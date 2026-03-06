import { createHash } from 'crypto';

/**
 * Hash-based embedding dedup.
 * Same text + same model = same embedding. Never re-embed or re-pay.
 * TTL: 90 days. Invalidate on model version change.
 */
export class EmbeddingCache {
    // Mock DB storage
    private storage: Map<string, { embedding: number[], lastUsedAt: Date }> = new Map();

    async getOrEmbed(text: string, model: string): Promise<number[]> {
        const hash = createHash('sha256').update(`${model}:${text}`).digest('hex');

        // const cached = await db.embeddingCache.findUnique({ where: { textHash: hash } })
        const cached = this.storage.get(hash);

        if (cached) {
            /*
            await db.embeddingCache.update({
              where: { textHash: hash },
              data: { lastUsedAt: new Date() }
            })
            */
            cached.lastUsedAt = new Date();
            return cached.embedding;
        }

        const embedding = await this.embed(text, model);

        /*
        await db.embeddingCache.upsert({
          where: { textHash: hash },
          update: { embedding, lastUsedAt: new Date() },
          create: { textHash: hash, model, embedding }
        })
        */
        this.storage.set(hash, { embedding, lastUsedAt: new Date() });
        return embedding;
    }

    private async embed(text: string, model: string): Promise<number[]> {
        // Call OpenAI embeddings API (default) or configured provider
        // Mocking an embedding generation
        return Array(1536).fill(0).map(() => Math.random() * 2 - 1);
    }
}
