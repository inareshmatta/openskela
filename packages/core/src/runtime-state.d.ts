import type { Message, NormalizedToolCall } from './types';
export declare enum AgentState {
    IDLE = "idle",
    PLANNING = "planning",
    EXECUTING_TOOL = "executing_tool",
    SYNTHESIZING = "synthesizing",
    COMPLETE = "complete"
}
export interface RuntimeSnapshot {
    agentId: string;
    agentState: AgentState;
    iteration: number;
    messages: Message[];
    workingMemory: Record<string, unknown>;
    spawnTree: Record<string, unknown>;
    totalCost: number;
    pendingApproval: NormalizedToolCall | null;
}
/**
 * Agent state is ALWAYS persisted to Postgres.
 * If process crashes, agent resumes from last saved state.
 * Never trust in-memory state across restarts.
 */
export declare class AgentRuntimeState {
    private storage;
    save(sessionId: string, state: RuntimeSnapshot): Promise<void>;
    load(sessionId: string): Promise<RuntimeSnapshot | null>;
    clear(sessionId: string): Promise<void>;
}
