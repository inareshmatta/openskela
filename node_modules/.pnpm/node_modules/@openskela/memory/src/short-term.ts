import { OpenSkeleaError } from '@openskela/core';

export interface WorkingMemoryItem {
    key: string;
    value: unknown;
    updatedAt: Date;
}

export class ShortTermMemory {
    // In-memory per session
    private sessions = new Map<string, Map<string, WorkingMemoryItem>>();

    async set(sessionId: string, key: string, value: unknown): Promise<void> {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, new Map());
        }
        const sessionMem = this.sessions.get(sessionId)!;
        sessionMem.set(key, { key, value, updatedAt: new Date() });
    }

    async get(sessionId: string, key: string): Promise<unknown | null> {
        const sessionMem = this.sessions.get(sessionId);
        if (!sessionMem) return null;
        const item = sessionMem.get(key);
        return item ? item.value : null;
    }

    async clear(sessionId: string): Promise<void> {
        this.sessions.delete(sessionId);
    }

    async getAll(sessionId: string): Promise<Record<string, unknown>> {
        const sessionMem = this.sessions.get(sessionId);
        if (!sessionMem) return {};

        const result: Record<string, unknown> = {};
        for (const [key, item] of sessionMem.entries()) {
            result[key] = item.value;
        }
        return result;
    }
}
