"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VectorMemory = void 0;
class VectorMemory {
    embeddingCache;
    // Mock Qdrant
    qdrant = new Map();
    constructor(embeddingCache) {
        this.embeddingCache = embeddingCache;
    }
    async upsert(doc, model = 'text-embedding-3-small') {
        const vector = await this.embeddingCache.getOrEmbed(doc.text, model);
        const id = `vec_${Math.random().toString(36).substr(2, 9)}`;
        this.qdrant.set(id, { ...doc, id, vector });
        return id;
    }
    async search(userId, query, limit = 5, model = 'text-embedding-3-small') {
        await this.embeddingCache.getOrEmbed(query, model); // Just for caching side-effects in mock
        // In a real implementation this would perform a Cosine Similarity search in Qdrant
        // Here we do a mock keyword match instead just to return something
        const q = query.toLowerCase();
        const results = Array.from(this.qdrant.values())
            .filter(doc => doc.userId === userId && doc.text.toLowerCase().includes(q))
            .slice(0, limit);
        return results;
    }
    async delete(id) {
        return this.qdrant.delete(id);
    }
}
exports.VectorMemory = VectorMemory;
