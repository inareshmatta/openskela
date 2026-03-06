import type { LLMProvider, Message, ToolDefinition, CompletionOptions, AgentResponse } from '@openskela/core';
import { BaseLLMAdapter } from './base';
export declare class ProviderRateLimiter {
    private limits;
    throttle(provider: LLMProvider): Promise<void>;
}
export declare class LLMPool {
    private adapters;
    private circuitBreaker;
    private rateLimiter;
    private routingDefaults;
    registerAdapter(adapter: BaseLLMAdapter): void;
    getAdapter(provider: LLMProvider): BaseLLMAdapter;
    private route;
    private getFallback;
    private isRetryableError;
    complete(messages: Message[], tools: ToolDefinition[], options?: CompletionOptions): Promise<AgentResponse>;
    /** Trading: require dual-model consensus — Claude + Grok */
    tradingConsensus(messages: Message[], tools: ToolDefinition[]): Promise<{
        claude: AgentResponse;
        grok: AgentResponse;
    }>;
}
