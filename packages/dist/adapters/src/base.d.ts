import type { LLMProvider, Message, ToolDefinition, CompletionOptions, AgentResponse, NormalizedToolCall, TokenUsage } from '@openskela/core';
export declare abstract class BaseLLMAdapter {
    abstract readonly provider: LLMProvider;
    abstract readonly model: string;
    abstract readonly supportsVision: boolean;
    abstract readonly supportsReasoning: boolean;
    abstract readonly supportsCacheControl: boolean;
    abstract complete(messages: Message[], tools: ToolDefinition[], options?: CompletionOptions): Promise<AgentResponse>;
    abstract formatTools(tools: ToolDefinition[]): unknown;
    abstract parseToolCall(response: unknown): NormalizedToolCall | null;
    abstract calculateCost(usage: TokenUsage): number;
    /** Model version this adapter was tested against — for compatibility matrix */
    abstract readonly testedModelVersion: string;
}
