import type { EmbeddingCache } from './embedding-cache';
export interface VectorDocument {
    id: string;
    userId: string;
    text: string;
    metadata: Record<string, unknown>;
    vector?: number[];
}
export declare class VectorMemory {
    private embeddingCache;
    private qdrant;
    constructor(embeddingCache: EmbeddingCache);
    upsert(doc: Omit<VectorDocument, 'id'>, model?: string): Promise<string>;
    search(userId: string, query: string, limit?: number, model?: string): Promise<VectorDocument[]>;
    delete(id: string): Promise<boolean>;
}
