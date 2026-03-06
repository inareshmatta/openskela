"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LongTermMemory = void 0;
class LongTermMemory {
    // Mock Postgres DB
    database = new Map();
    async save(fact) {
        const id = `fact_${Math.random().toString(36).substr(2, 9)}`;
        const newFact = { ...fact, id, createdAt: new Date() };
        this.database.set(id, newFact);
        return newFact;
    }
    async get(id) {
        return this.database.get(id) || null;
    }
    async search(userId, query) {
        const q = query.toLowerCase();
        const results = [];
        for (const fact of this.database.values()) {
            if (fact.userId === userId && (fact.content.toLowerCase().includes(q) || fact.topic.toLowerCase().includes(q))) {
                results.push(fact);
            }
        }
        return results;
    }
    async forget(id) {
        return this.database.delete(id);
    }
    async getUserFacts(userId) {
        return Array.from(this.database.values()).filter(f => f.userId === userId);
    }
}
exports.LongTermMemory = LongTermMemory;
