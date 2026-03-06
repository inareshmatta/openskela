import type { Agent, AgentConfig, AgentRunResult } from './agent';
export interface SpawnConfig {
    maxDepth: number;
    maxConcurrentChildren: number;
}
export interface SpawnRequest {
    name: string;
    task: string;
    tools?: string[];
    autoTerminate?: boolean;
    onComplete?: (result: AgentRunResult) => void;
}
export declare class Tracer {
    recordSpawn(parentId: string, childId: string): void;
}
export declare class CostTracker {
    recordCost(amount: number): void;
}
export interface AgentFactory {
    create(config: AgentConfig, spawner: AgentSpawner): Agent;
}
export declare class AgentSpawner {
    private parentAgentId;
    private currentDepth;
    private config;
    private agentFactory;
    private costTracker;
    private tracer;
    private children;
    private _childCount;
    private spawnTree;
    constructor(parentAgentId: string, currentDepth: number, config: SpawnConfig, agentFactory: AgentFactory, costTracker: CostTracker, tracer: Tracer);
    get childCount(): number;
    getTree(): Record<string, string[]>;
    spawn(parent: Agent, request: SpawnRequest): Promise<AgentRunResult>;
    spawnMany(parent: Agent, requests: SpawnRequest[]): Promise<AgentRunResult[]>;
    fanOut(parent: Agent, task: string, subtasks: string[], tools?: string[]): Promise<string>;
    private buildChildConfig;
    private validateDepth;
    private validateConcurrency;
    private validateCostBudget;
    private terminate;
}
