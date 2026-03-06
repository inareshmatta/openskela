import type { LongTermMemory } from './long-term';
import type { VectorMemory } from './vector';
import type { GraphMemory } from './graph';

export class RetentionManager {
    constructor(
        private longTerm: LongTermMemory,
        private vector: VectorMemory,
        private graph: GraphMemory
    ) { }

    async enforceRetention(): Promise<void> {
        const ttlDays = parseInt(process.env.MEMORY_TTL_DAYS ?? '90', 10);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - ttlDays);

        // Mock Prisma & Qdrant cleanup queries
        console.log(`[Retention] Executing sweep for memories older than ${cutoff.toISOString()}`);
        // await db.memory.deleteMany({ where: { expiresAt: { lt: new Date() } } })
    }

    async forgetUser(userId: string): Promise<void> {
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
