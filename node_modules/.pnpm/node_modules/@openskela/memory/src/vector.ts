import type { EmbeddingCache } from './embedding-cache';

export interface VectorDocument {
    id: string;
    userId: string;
    text: string;
    metadata: Record<string, unknown>;
    vector?: number[];
}

export class VectorMemory {
    // Mock Qdrant
    private qdrant = new Map<string, VectorDocument>();

    constructor(private embeddingCache: EmbeddingCache) { }

    async upsert(doc: Omit<VectorDocument, 'id'>, model: string = 'text-embedding-3-small'): Promise<string> {
        const vector = await this.embeddingCache.getOrEmbed(doc.text, model);
        const id = `vec_${Math.random().toString(36).substr(2, 9)}`;

        this.qdrant.set(id, { ...doc, id, vector });
        return id;
    }

    async search(userId: string, query: string, limit: number = 5, model: string = 'text-embedding-3-small'): Promise<VectorDocument[]> {
        await this.embeddingCache.getOrEmbed(query, model); // Just for caching side-effects in mock

        // In a real implementation this would perform a Cosine Similarity search in Qdrant
        // Here we do a mock keyword match instead just to return something
        const q = query.toLowerCase();
        const results = Array.from(this.qdrant.values())
            .filter(doc => doc.userId === userId && doc.text.toLowerCase().includes(q))
            .slice(0, limit);

        return results;
    }

    async delete(id: string): Promise<boolean> {
        return this.qdrant.delete(id);
    }
}
