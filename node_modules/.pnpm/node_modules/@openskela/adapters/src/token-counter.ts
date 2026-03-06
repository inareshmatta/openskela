import Anthropic from '@anthropic-ai/sdk';
import { encoding_for_model, type TiktokenModel } from 'tiktoken';
import type { LLMProvider } from '@openskela/core';

export class TokenCounter {
    /**
     * Count tokens accurately per provider.
     * Post-response: reconcile estimated vs actual (response.usage always wins).
     */
    static count(text: string, provider: LLMProvider, model: string): number {
        switch (provider) {
            case 'claude':
                return this.approximateClaude(text);

            case 'openai':
            case 'grok':    // grok uses same tokenizer
                return this.countWithTiktoken(text, model);

            case 'gemini':
                return this.approximateGemini(text);

            case 'ollama':
                return this.approximateLocal(text);

            default:
                return Math.ceil(text.length / 4);
        }
    }

    /**
     * Multimodal token calculation for Gemini
     * Images: ceil(width/16) * ceil(height/16) * 258 tokens per tile
     */
    static countImage(width: number, height: number, provider: LLMProvider): number {
        if (provider === 'gemini') {
            const tiles = Math.ceil(width / 16) * Math.ceil(height / 16);
            return tiles * 258;
        }
        // OpenAI: 85 base + 170 per 512px tile
        const tiles = Math.ceil(width / 512) * Math.ceil(height / 512);
        return 85 + 170 * tiles;
    }

    /** Reconcile: after every LLM call, actual usage from response overrides estimate */
    static reconcile(estimated: number, actual: number, provider: LLMProvider): void {
        const drift = Math.abs(estimated - actual) / actual;
        if (drift > 0.1) {
            console.warn(`[TokenCounter] >10% estimation drift for provider ${provider}. Estimated: ${estimated}, Actual: ${actual}`);
        }
    }

    private static countWithTiktoken(text: string, model: string): number {
        try {
            // Map model aliases or fall back to cl100k_base equivalent if unlisted
            let tiktokenModel = model as TiktokenModel;
            if (model.includes('o1') || model.includes('o3') || model.includes('gpt-4o')) {
                tiktokenModel = 'gpt-4o';
            }
            const enc = encoding_for_model(tiktokenModel);
            const count = enc.encode(text).length;
            enc.free();
            return count;
        } catch {
            return Math.ceil(text.length / 4); // fallback
        }
    }

    private static approximateClaude(text: string): number {
        // Claude uses a BPE tokenizer similar to GPT
        // ~4 chars per token for English, less for code
        return Math.ceil(text.length / 3.8);
    }

    private static approximateGemini(text: string): number {
        return Math.ceil(text.length / 4);
    }

    private static approximateLocal(text: string): number {
        return Math.ceil(text.length / 4);
    }
}
