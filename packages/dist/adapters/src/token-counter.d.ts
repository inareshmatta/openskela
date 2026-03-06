import type { LLMProvider } from '@openskela/core';
export declare class TokenCounter {
    /**
     * Count tokens accurately per provider.
     * Post-response: reconcile estimated vs actual (response.usage always wins).
     */
    static count(text: string, provider: LLMProvider, model: string): number;
    /**
     * Multimodal token calculation for Gemini
     * Images: ceil(width/16) * ceil(height/16) * 258 tokens per tile
     */
    static countImage(width: number, height: number, provider: LLMProvider): number;
    /** Reconcile: after every LLM call, actual usage from response overrides estimate */
    static reconcile(estimated: number, actual: number, provider: LLMProvider): void;
    private static countWithTiktoken;
    private static approximateClaude;
    private static approximateGemini;
    private static approximateLocal;
}
