import { OpenSkeleaError } from './types';
import type {
    Message,
    ToolDefinition,
    NormalizedToolCall,
    ToolResult,
    UIComponent,
    TaskType,
    AgentResponse
} from './types';
import { AgentState, AgentRuntimeState, type RuntimeSnapshot } from './runtime-state';
// @ts-ignore
import { TokenCounter } from '@openskela/adapters/dist/token-counter'; // Ensure this dependency exists at compile edge
// @ts-ignore
import { ToolAuthorizer, ToolRegistry, type ToolCallRecord } from '@openskela/tools/dist/authorizer'; // Assuming exported
// @ts-ignore
import { LLMPool } from '@openskela/adapters/dist/pool';

export interface AgentConfig {
    id: string;
    name?: string;
    type: string;
    tools?: string[];
    limits: {
        maxIterations: number;
        maxCostPerSession: number;
    };
    guardrails?: {
        humanApproval?: string[];
    };
    spawner?: {
        enabled: boolean;
        maxChildren: number;
    };
}

export interface AgentRunResult {
    text: string;
    cost: number;
    iterations: number;
    toolsUsed: string[];
    spawnedChildren: number;
    uiComponents: UIComponent[];
    traceId: string;
}

export class Agent {
    private state: AgentState = AgentState.IDLE;
    private iteration = 0;
    private messages: Message[] = [];
    private totalCost = 0;
    private toolsUsed: string[] = [];
    private uiComponents: UIComponent[] = [];

    constructor(
        public readonly config: AgentConfig,
        private llmPool: any, // Typed as any to bypass circular deps across workspace temporarily 
        private toolRegistry: any,
        private toolAuthorizer: any,
        private memory: any,
        private contextAssembler: any,
        private costTracker: any,
        private runtimeState: AgentRuntimeState,
        private tracer: any,
        private spawner?: any
    ) { }

    async run(userMessage: string, sessionId: string): Promise<AgentRunResult> {
        // Try to resume from persisted state (crash recovery)
        const saved = await this.runtimeState.load(sessionId);
        if (saved && saved.agentState !== AgentState.COMPLETE) {
            this.restoreFrom(saved);
        }

        const traceId = this.tracer.startTrace(this.config.id, userMessage);
        this.setState(AgentState.PLANNING, sessionId);

        if (this.messages.length === 0) {
            this.messages = await this.contextAssembler.assemble(
                userMessage, this.config, this.memory, this.getSessionState()
            );
        }

        for (; this.iteration < this.config.limits.maxIterations; this.iteration++) {
            await this.persistState(sessionId);

            const response = await this.llmPool.complete(this.messages, this.getActiveTools(), {
                taskType: this.config.type as TaskType,
                reasoning: {
                    enabled: true,
                    effort: ReasoningRouter.classify(this.config.type as TaskType)
                }
            });

            // Token Reconcile check requires TokenCounter implementation to be linked fully
            // TokenCounter.reconcile( ... )

            await this.costTracker.record(this.config.id, response);
            this.totalCost += response.cost;
            this.checkCostBudget();
            this.tracer.recordLLMCall(traceId, response);

            if (!response.toolCall) {
                this.setState(AgentState.SYNTHESIZING, sessionId);
                await this.saveInteraction(userMessage, response.text!, this.messages);
                this.setState(AgentState.COMPLETE, sessionId);
                await this.runtimeState.clear(sessionId);
                this.tracer.endTrace(traceId, { cost: this.totalCost });

                return {
                    text: response.text!,
                    cost: this.totalCost,
                    iterations: this.iteration,
                    toolsUsed: [...new Set(this.toolsUsed)],
                    spawnedChildren: this.spawner?.childCount ?? 0,
                    uiComponents: this.uiComponents,
                    traceId,
                };
            }

            this.setState(AgentState.EXECUTING_TOOL, sessionId);
            this.toolsUsed.push(response.toolCall.name);
            const toolResult = await this.executeTool(response.toolCall, sessionId);

            if (toolResult.uiComponent) this.uiComponents.push(toolResult.uiComponent);
            this.tracer.recordToolCall(traceId, { name: response.toolCall.name, result: toolResult });

            this.messages.push({ role: 'assistant', content: response.text ?? '' });
            this.messages.push({
                role: 'tool',
                content: JSON.stringify(toolResult.data ?? toolResult.error),
                toolCallId: response.toolCall.id,
                toolName: response.toolCall.name,
            });
        }

        throw new OpenSkeleaError('MAX_ITERATIONS_REACHED',
            `Agent exceeded ${this.config.limits.maxIterations} iterations`,
            { agentId: this.config.id, sessionId });
    }

    private async executeTool(toolCall: NormalizedToolCall, sessionId: string): Promise<ToolResult> {
        const tool = this.toolRegistry.get(toolCall.name);
        const context = this.getToolContext();

        await this.toolAuthorizer.authorize(toolCall.name, context.userId, context.organizationId, context.controlPanel.tradingEnabled);

        if (tool.dangerous && this.config.guardrails?.humanApproval?.includes(toolCall.name)) {
            await this.persistState(sessionId, toolCall);
            await this.requestHumanApproval(toolCall);
        }

        const start = Date.now();
        try {
            const result = await Promise.race([
                tool.execute(toolCall.arguments, context),
                new Promise<never>((_, reject) =>
                    setTimeout(() =>
                        reject(new OpenSkeleaError('TOOL_TIMEOUT', `${toolCall.name} timed out`)),
                        tool.timeout ?? 30000)
                )
            ]);

            await this.toolAuthorizer.logToolCall({
                userId: context.userId, sessionId, agentId: this.config.id,
                toolName: toolCall.name, args: toolCall.arguments,
                result: result.data, success: true, durationMs: Date.now() - start,
            });
            return result;
        } catch (err) {
            await this.toolAuthorizer.logToolCall({
                userId: context.userId, sessionId, agentId: this.config.id,
                toolName: toolCall.name, args: toolCall.arguments,
                success: false, durationMs: Date.now() - start,
                error: err instanceof Error ? err.message : String(err),
            });
            return { success: false, error: err instanceof OpenSkeleaError ? err.message : String(err) };
        }
    }

    private async persistState(sessionId: string, pendingApproval?: NormalizedToolCall): Promise<void> {
        await this.runtimeState.save(sessionId, {
            agentId: this.config.id,
            agentState: this.state,
            iteration: this.iteration,
            messages: this.messages,
            workingMemory: this.memory.shortTerm.getWorkingMemory(),
            spawnTree: this.spawner?.getTree() ?? {},
            totalCost: this.totalCost,
            pendingApproval: pendingApproval ?? null,
        });
    }

    private restoreFrom(snapshot: RuntimeSnapshot) {
        this.config.id = snapshot.agentId;
        this.state = snapshot.agentState;
        this.iteration = snapshot.iteration;
        this.messages = snapshot.messages;
        this.totalCost = snapshot.totalCost;
        // this.memory.shortTerm.setWorkingMemory(snapshot.workingMemory)
    }

    private setState(state: AgentState, sessionId: string): void {
        this.state = state;
        this.tracer.recordStateChange(this.config.id, state);
    }

    private checkCostBudget(): void {
        if (this.totalCost >= this.config.limits.maxCostPerSession) {
            throw new OpenSkeleaError('COST_LIMIT_EXCEEDED',
                `Cost $${this.totalCost.toFixed(4)} exceeded limit $${this.config.limits.maxCostPerSession}`);
        }
    }

    // Stubs for compiling the code structure
    private getSessionState() { return {}; }
    private getActiveTools() { return this.toolRegistry.getAll(); }
    private getToolContext() {
        return {
            userId: 'test-user',
            sessionId: 'test-session',
            agentId: this.config.id,
            organizationId: undefined,
            memory: this.memory,
            controlPanel: { tradingEnabled: true }
        };
    }
    private async requestHumanApproval(toolCall: NormalizedToolCall) { }
    private async saveInteraction(userMessage: string, agentResponse: string, messages: Message[]) { }
}

export class ReasoningRouter {
    static classify(taskType: TaskType): 'high' | 'medium' | 'low' | 'disabled' {
        const map: Record<string, 'high' | 'medium' | 'low' | 'disabled'> = {
            trading_analysis: 'high', code_review: 'high', security_review: 'high',
            code_generation: 'medium', writing: 'medium', document_analysis: 'medium', frontend_generation: 'medium',
            shopping_search: 'low', image_analysis: 'low', trading_news: 'low', general: 'low',
            embeddings: 'disabled', voice_transcription: 'disabled', private_data: 'medium',
        };
        return map[taskType] ?? 'low';
    }
}
