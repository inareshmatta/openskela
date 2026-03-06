import type { LLMProvider } from '@openskela/core';
export interface CircuitBreakerState {
    provider: LLMProvider;
    state: 'closed' | 'open' | 'half_open';
    failureCount: number;
    lastFailureAt?: number;
    openedAt?: number;
    cooldownMs: number;
}
export declare class CircuitBreaker {
    private states;
    recordFailure(provider: LLMProvider): void;
    recordSuccess(provider: LLMProvider): void;
    isOpen(provider: LLMProvider): boolean;
    private getState;
}
