"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReasoningRouter = exports.Agent = void 0;
const types_1 = require("./types");
const runtime_state_1 = require("./runtime-state");
class Agent {
    config;
    llmPool;
    toolRegistry;
    toolAuthorizer;
    memory;
    contextAssembler;
    costTracker;
    runtimeState;
    tracer;
    spawner;
    state = runtime_state_1.AgentState.IDLE;
    iteration = 0;
    messages = [];
    totalCost = 0;
    toolsUsed = [];
    uiComponents = [];
    constructor(config, llmPool, // Typed as any to bypass circular deps across workspace temporarily 
    toolRegistry, toolAuthorizer, memory, contextAssembler, costTracker, runtimeState, tracer, spawner) {
        this.config = config;
        this.llmPool = llmPool;
        this.toolRegistry = toolRegistry;
        this.toolAuthorizer = toolAuthorizer;
        this.memory = memory;
        this.contextAssembler = contextAssembler;
        this.costTracker = costTracker;
        this.runtimeState = runtimeState;
        this.tracer = tracer;
        this.spawner = spawner;
    }
    async run(userMessage, sessionId) {
        // Try to resume from persisted state (crash recovery)
        const saved = await this.runtimeState.load(sessionId);
        if (saved && saved.agentState !== runtime_state_1.AgentState.COMPLETE) {
            this.restoreFrom(saved);
        }
        const traceId = this.tracer.startTrace(this.config.id, userMessage);
        this.setState(runtime_state_1.AgentState.PLANNING, sessionId);
        if (this.messages.length === 0) {
            this.messages = await this.contextAssembler.assemble(userMessage, this.config, this.memory, this.getSessionState());
        }
        for (; this.iteration < this.config.limits.maxIterations; this.iteration++) {
            await this.persistState(sessionId);
            const response = await this.llmPool.complete(this.messages, this.getActiveTools(), {
                taskType: this.config.type,
                reasoning: {
                    enabled: true,
                    effort: ReasoningRouter.classify(this.config.type)
                }
            });
            // Token Reconcile check requires TokenCounter implementation to be linked fully
            // TokenCounter.reconcile( ... )
            await this.costTracker.record(this.config.id, response);
            this.totalCost += response.cost;
            this.checkCostBudget();
            this.tracer.recordLLMCall(traceId, response);
            if (!response.toolCall) {
                this.setState(runtime_state_1.AgentState.SYNTHESIZING, sessionId);
                await this.saveInteraction(userMessage, response.text, this.messages);
                this.setState(runtime_state_1.AgentState.COMPLETE, sessionId);
                await this.runtimeState.clear(sessionId);
                this.tracer.endTrace(traceId, { cost: this.totalCost });
                return {
                    text: response.text,
                    cost: this.totalCost,
                    iterations: this.iteration,
                    toolsUsed: [...new Set(this.toolsUsed)],
                    spawnedChildren: this.spawner?.childCount ?? 0,
                    uiComponents: this.uiComponents,
                    traceId,
                };
            }
            this.setState(runtime_state_1.AgentState.EXECUTING_TOOL, sessionId);
            this.toolsUsed.push(response.toolCall.name);
            const toolResult = await this.executeTool(response.toolCall, sessionId);
            if (toolResult.uiComponent)
                this.uiComponents.push(toolResult.uiComponent);
            this.tracer.recordToolCall(traceId, { name: response.toolCall.name, result: toolResult });
            this.messages.push({ role: 'assistant', content: response.text ?? '' });
            this.messages.push({
                role: 'tool',
                content: JSON.stringify(toolResult.data ?? toolResult.error),
                toolCallId: response.toolCall.id,
                toolName: response.toolCall.name,
            });
        }
        throw new types_1.OpenSkeleaError('MAX_ITERATIONS_REACHED', `Agent exceeded ${this.config.limits.maxIterations} iterations`, { agentId: this.config.id, sessionId });
    }
    async executeTool(toolCall, sessionId) {
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
                new Promise((_, reject) => setTimeout(() => reject(new types_1.OpenSkeleaError('TOOL_TIMEOUT', `${toolCall.name} timed out`)), tool.timeout ?? 30000))
            ]);
            await this.toolAuthorizer.logToolCall({
                userId: context.userId, sessionId, agentId: this.config.id,
                toolName: toolCall.name, args: toolCall.arguments,
                result: result.data, success: true, durationMs: Date.now() - start,
            });
            return result;
        }
        catch (err) {
            await this.toolAuthorizer.logToolCall({
                userId: context.userId, sessionId, agentId: this.config.id,
                toolName: toolCall.name, args: toolCall.arguments,
                success: false, durationMs: Date.now() - start,
                error: err instanceof Error ? err.message : String(err),
            });
            return { success: false, error: err instanceof types_1.OpenSkeleaError ? err.message : String(err) };
        }
    }
    async persistState(sessionId, pendingApproval) {
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
    restoreFrom(snapshot) {
        this.config.id = snapshot.agentId;
        this.state = snapshot.agentState;
        this.iteration = snapshot.iteration;
        this.messages = snapshot.messages;
        this.totalCost = snapshot.totalCost;
        // this.memory.shortTerm.setWorkingMemory(snapshot.workingMemory)
    }
    setState(state, sessionId) {
        this.state = state;
        this.tracer.recordStateChange(this.config.id, state);
    }
    checkCostBudget() {
        if (this.totalCost >= this.config.limits.maxCostPerSession) {
            throw new types_1.OpenSkeleaError('COST_LIMIT_EXCEEDED', `Cost $${this.totalCost.toFixed(4)} exceeded limit $${this.config.limits.maxCostPerSession}`);
        }
    }
    // Stubs for compiling the code structure
    getSessionState() { return {}; }
    getActiveTools() { return this.toolRegistry.getAll(); }
    getToolContext() {
        return {
            userId: 'test-user',
            sessionId: 'test-session',
            agentId: this.config.id,
            organizationId: undefined,
            memory: this.memory,
            controlPanel: { tradingEnabled: true }
        };
    }
    async requestHumanApproval(toolCall) { }
    async saveInteraction(userMessage, agentResponse, messages) { }
}
exports.Agent = Agent;
class ReasoningRouter {
    static classify(taskType) {
        const map = {
            trading_analysis: 'high', code_review: 'high', security_review: 'high',
            code_generation: 'medium', writing: 'medium', document_analysis: 'medium', frontend_generation: 'medium',
            shopping_search: 'low', image_analysis: 'low', trading_news: 'low', general: 'low',
            embeddings: 'disabled', voice_transcription: 'disabled', private_data: 'medium',
        };
        return map[taskType] ?? 'low';
    }
}
exports.ReasoningRouter = ReasoningRouter;
