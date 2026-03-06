import type { UIComponent, TaskType } from './types';
import { AgentRuntimeState } from './runtime-state';
export interface AgentConfig {
    id: string;
    type: string;
    limits: {
        maxIterations: number;
        maxCostPerSession: number;
    };
    guardrails?: {
        humanApproval?: string[];
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
export declare class Agent {
    private config;
    private llmPool;
    private toolRegistry;
    private toolAuthorizer;
    private memory;
    private contextAssembler;
    private costTracker;
    private runtimeState;
    private tracer;
    private spawner?;
    private state;
    private iteration;
    private messages;
    private totalCost;
    private toolsUsed;
    private uiComponents;
    constructor(config: AgentConfig, llmPool: any, // Typed as any to bypass circular deps across workspace temporarily 
    toolRegistry: any, toolAuthorizer: any, memory: any, contextAssembler: any, costTracker: any, runtimeState: AgentRuntimeState, tracer: any, spawner?: any | undefined);
    run(userMessage: string, sessionId: string): Promise<AgentRunResult>;
    private executeTool;
    private persistState;
    private restoreFrom;
    private setState;
    private checkCostBudget;
    private getSessionState;
    private getActiveTools;
    private getToolContext;
    private requestHumanApproval;
    private saveInteraction;
}
export declare class ReasoningRouter {
    static classify(taskType: TaskType): 'high' | 'medium' | 'low' | 'disabled';
}
