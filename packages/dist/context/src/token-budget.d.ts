import type { Message } from '@openskela/core';
export declare class TokenBudget {
    private readonly RESERVED;
    available(totalModelLimit: number): number;
    compress(messages: Message[], maxTokens: number): Message[];
}
