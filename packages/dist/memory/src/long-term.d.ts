export interface LongTermFact {
    id: string;
    userId: string;
    topic: string;
    content: string;
    confidence: number;
    createdAt: Date;
    expiresAt?: Date;
}
export declare class LongTermMemory {
    private database;
    save(fact: Omit<LongTermFact, 'id' | 'createdAt'>): Promise<LongTermFact>;
    get(id: string): Promise<LongTermFact | null>;
    search(userId: string, query: string): Promise<LongTermFact[]>;
    forget(id: string): Promise<boolean>;
    getUserFacts(userId: string): Promise<LongTermFact[]>;
}
