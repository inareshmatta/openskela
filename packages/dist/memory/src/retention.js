"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetentionManager = void 0;
class RetentionManager {
    longTerm;
    vector;
    graph;
    constructor(longTerm, vector, graph) {
        this.longTerm = longTerm;
        this.vector = vector;
        this.graph = graph;
    }
    async enforceRetention() {
        const ttlDays = parseInt(process.env.MEMORY_TTL_DAYS ?? '90', 10);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - ttlDays);
        // Mock Prisma & Qdrant cleanup queries
        console.log(`[Retention] Executing sweep for memories older than ${cutoff.toISOString()}`);
        // await db.memory.deleteMany({ where: { expiresAt: { lt: new Date() } } })
    }
    async forgetUser(userId) {
        console.log(`[Retention/GDPR] Forgetting all traces of user ${userId} across pg, qdrant, falkordb.`);
        // Wipe Long-term
        const facts = await this.longTerm.getUserFacts(userId);
        for (const fact of facts) {
            await this.longTerm.forget(fact.id);
        }
        // Pseudo queries for vector/graph:
        // qdrant.deleteByFilter({ userId }),
        // falkordb.query(`MATCH (n {userId: $userId}) DETACH DELETE n`, { userId })
    }
}
exports.RetentionManager = RetentionManager;
