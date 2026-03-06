export interface WorkingMemoryItem {
    key: string;
    value: unknown;
    updatedAt: Date;
}
export declare class ShortTermMemory {
    private sessions;
    set(sessionId: string, key: string, value: unknown): Promise<void>;
    get(sessionId: string, key: string): Promise<unknown | null>;
    clear(sessionId: string): Promise<void>;
    getAll(sessionId: string): Promise<Record<string, unknown>>;
}
