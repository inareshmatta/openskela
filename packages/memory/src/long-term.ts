export interface LongTermFact {
    id: string;
    userId: string;
    topic: string;
    content: string;
    confidence: number;
    createdAt: Date;
    expiresAt?: Date;
}

export class LongTermMemory {
    // Mock Postgres DB
    private database = new Map<string, LongTermFact>();

    async save(fact: Omit<LongTermFact, 'id' | 'createdAt'>): Promise<LongTermFact> {
        const id = `fact_${Math.random().toString(36).substr(2, 9)}`;
        const newFact: LongTermFact = { ...fact, id, createdAt: new Date() };
        this.database.set(id, newFact);
        return newFact;
    }

    async get(id: string): Promise<LongTermFact | null> {
        return this.database.get(id) || null;
    }

    async search(userId: string, query: string): Promise<LongTermFact[]> {
        const q = query.toLowerCase();
        const results: LongTermFact[] = [];

        for (const fact of this.database.values()) {
            if (fact.userId === userId && (fact.content.toLowerCase().includes(q) || fact.topic.toLowerCase().includes(q))) {
                results.push(fact);
            }
        }
        return results;
    }

    async forget(id: string): Promise<boolean> {
        return this.database.delete(id);
    }

    async getUserFacts(userId: string): Promise<LongTermFact[]> {
        return Array.from(this.database.values()).filter(f => f.userId === userId);
    }
}
