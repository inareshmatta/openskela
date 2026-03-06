import type { Message, NormalizedToolCall } from './types';

export enum AgentState {
    IDLE = 'idle',
    PLANNING = 'planning',
    EXECUTING_TOOL = 'executing_tool',
    SYNTHESIZING = 'synthesizing',
    COMPLETE = 'complete'
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
export class AgentRuntimeState {
    // We mock the Prisma DB interactions for Phase 1 skeleton
    private storage: Map<string, RuntimeSnapshot> = new Map();

    async save(sessionId: string, state: RuntimeSnapshot): Promise<void> {
        // await db.agentRuntime.upsert(...)
        this.storage.set(sessionId, JSON.parse(JSON.stringify(state)));
    }

    async load(sessionId: string): Promise<RuntimeSnapshot | null> {
        // const runtime = await db.agentRuntime.findUnique({ where: { sessionId } })
        const runtime = this.storage.get(sessionId);
        if (!runtime) return null;

        return JSON.parse(JSON.stringify(runtime));
    }

    async clear(sessionId: string): Promise<void> {
        // await db.agentRuntime.delete({ where: { sessionId } })
        this.storage.delete(sessionId);
    }
}
