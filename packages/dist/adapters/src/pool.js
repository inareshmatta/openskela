"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LLMPool = exports.ProviderRateLimiter = void 0;
const circuit_breaker_1 = require("./circuit-breaker");
const core_1 = require("@openskela/core");
class ProviderRateLimiter {
    limits = new Map([
        // These could be pulled from process.env via config service later
        ['claude', { rpm: 50, tpm: 100000 }],
        ['openai', { rpm: 60, tpm: 150000 }],
        ['gemini', { rpm: 60, tpm: 1000000 }],
        ['grok', { rpm: 30, tpm: 50000 }],
        ['ollama', { rpm: 9999, tpm: 9999 }],
    ]);
    async throttle(provider) {
        // Redis-backed sliding window per provider
        // Block (with exponential backoff) if approaching limit
        // TODO: implement ioredis limits
    }
}
exports.ProviderRateLimiter = ProviderRateLimiter;
class LLMPool {
    adapters = new Map();
    circuitBreaker = new circuit_breaker_1.CircuitBreaker();
    rateLimiter = new ProviderRateLimiter();
    // Basic routing map defaults mapped from OpenSkela plan
    routingDefaults = {
        code_generation: ['claude', 'openai'],
        code_review: ['claude', 'openai'],
        writing: ['claude', 'openai'],
        document_analysis: ['claude', 'gemini'],
        security_review: ['claude', 'openai'],
        trading_analysis: ['claude', 'grok'],
        trading_news: ['grok', 'claude'],
        shopping_search: ['gemini', 'openai'],
        image_analysis: ['gemini', 'openai'],
        frontend_generation: ['gemini', 'claude'],
        voice_transcription: ['openai'],
        embeddings: ['openai', 'gemini'],
        private_data: ['ollama', 'claude'],
        general: ['openai', 'claude']
    };
    registerAdapter(adapter) {
        this.adapters.set(adapter.provider, adapter);
    }
    getAdapter(provider) {
        const adapter = this.adapters.get(provider);
        if (!adapter) {
            throw new core_1.OpenSkeleaError('ADAPTER_NOT_FOUND', `No adapter registered for provider: ${provider}`);
        }
        return adapter;
    }
    route(taskType) {
        if (!taskType || !this.routingDefaults[taskType]) {
            return 'claude'; // default to primary
        }
        return this.routingDefaults[taskType][0]; // get best matching provider
    }
    getFallback(failedProvider, taskType) {
        if (taskType && this.routingDefaults[taskType]) {
            const candidates = this.routingDefaults[taskType];
            const idx = candidates.indexOf(failedProvider);
            if (idx !== -1 && idx + 1 < candidates.length) {
                return candidates[idx + 1];
            }
        }
        // Global fallbacks if task type routing doesn't find one
        if (failedProvider === 'claude')
            return 'openai';
        if (failedProvider === 'openai')
            return 'claude';
        if (failedProvider === 'gemini')
            return 'openai';
        if (failedProvider === 'grok')
            return 'claude';
        return null;
    }
    isRetryableError(err) {
        const msg = err instanceof Error ? err.message : String(err);
        return msg.includes('timeout') || msg.includes('502') || msg.includes('503') || msg.includes('429');
    }
    async complete(messages, tools, options) {
        const provider = options?.forceProvider ?? this.route(options?.taskType);
        if (this.circuitBreaker.isOpen(provider)) {
            const fallback = this.getFallback(provider, options?.taskType);
            if (!fallback)
                throw new core_1.OpenSkeleaError('CIRCUIT_BREAKER_OPEN', `${provider} circuit is open and no fallback available`);
            console.warn(`[LLMPool] Provider ${provider} circuit open. Falling back to ${fallback}`);
            return this.complete(messages, tools, { ...options, forceProvider: fallback });
        }
        try {
            const adapter = this.getAdapter(provider);
            await this.rateLimiter.throttle(provider);
            const start = Date.now();
            const response = await adapter.complete(messages, tools, options);
            response.latencyMs = Date.now() - start;
            this.circuitBreaker.recordSuccess(provider);
            return response;
        }
        catch (err) {
            this.circuitBreaker.recordFailure(provider);
            if (this.isRetryableError(err)) {
                console.warn(`[LLMPool] Retryable error from ${provider}, attempting failover`);
                const fallback = this.getFallback(provider, options?.taskType);
                if (fallback) {
                    return this.complete(messages, tools, { ...options, forceProvider: fallback });
                }
            }
            throw err;
        }
    }
    /** Trading: require dual-model consensus — Claude + Grok */
    async tradingConsensus(messages, tools) {
        const [claudeResponse, grokResponse] = await Promise.all([
            this.complete(messages, tools, {
                forceProvider: 'claude',
                taskType: 'trading_analysis',
                reasoning: { enabled: true, effort: 'high' }
            }),
            this.complete(messages, tools, {
                forceProvider: 'grok',
                taskType: 'trading_news'
            }),
        ]);
        return { claude: claudeResponse, grok: grokResponse };
    }
}
exports.LLMPool = LLMPool;
