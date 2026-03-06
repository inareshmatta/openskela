/**
 * Hash-based embedding dedup.
 * Same text + same model = same embedding. Never re-embed or re-pay.
 * TTL: 90 days. Invalidate on model version change.
 */
export declare class EmbeddingCache {
    private storage;
    getOrEmbed(text: string, model: string): Promise<number[]>;
    private embed;
}
