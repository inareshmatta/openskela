"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCounter = void 0;
const tiktoken_1 = require("tiktoken");
class TokenCounter {
    /**
     * Count tokens accurately per provider.
     * Post-response: reconcile estimated vs actual (response.usage always wins).
     */
    static count(text, provider, model) {
        switch (provider) {
            case 'claude':
                return this.approximateClaude(text);
            case 'openai':
            case 'grok': // grok uses same tokenizer
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
    static countImage(width, height, provider) {
        if (provider === 'gemini') {
            const tiles = Math.ceil(width / 16) * Math.ceil(height / 16);
            return tiles * 258;
        }
        // OpenAI: 85 base + 170 per 512px tile
        const tiles = Math.ceil(width / 512) * Math.ceil(height / 512);
        return 85 + 170 * tiles;
    }
    /** Reconcile: after every LLM call, actual usage from response overrides estimate */
    static reconcile(estimated, actual, provider) {
        const drift = Math.abs(estimated - actual) / actual;
        if (drift > 0.1) {
            console.warn(`[TokenCounter] >10% estimation drift for provider ${provider}. Estimated: ${estimated}, Actual: ${actual}`);
        }
    }
    static countWithTiktoken(text, model) {
        try {
            // Map model aliases or fall back to cl100k_base equivalent if unlisted
            let tiktokenModel = model;
            if (model.includes('o1') || model.includes('o3') || model.includes('gpt-4o')) {
                tiktokenModel = 'gpt-4o';
            }
            const enc = (0, tiktoken_1.encoding_for_model)(tiktokenModel);
            const count = enc.encode(text).length;
            enc.free();
            return count;
        }
        catch {
            return Math.ceil(text.length / 4); // fallback
        }
    }
    static approximateClaude(text) {
        // Claude uses a BPE tokenizer similar to GPT
        // ~4 chars per token for English, less for code
        return Math.ceil(text.length / 3.8);
    }
    static approximateGemini(text) {
        return Math.ceil(text.length / 4);
    }
    static approximateLocal(text) {
        return Math.ceil(text.length / 4);
    }
}
exports.TokenCounter = TokenCounter;
