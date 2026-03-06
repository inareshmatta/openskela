import type { JSONSchema, Message, CompletionOptions } from '@openskela/core';
import { BaseLLMAdapter } from './base';
export declare class StructuredLLM {
    private adapter;
    private ajv;
    constructor(adapter: BaseLLMAdapter);
    /**
     * Complete with enforced JSON schema output.
     * Retries up to MAX_RETRY times if output doesn't match schema.
     * Never returns unvalidated data.
     *
     * @throws OpenSkeleaError('STRUCTURED_OUTPUT_FAILED') after MAX_RETRY
     */
    complete<T>(schema: JSONSchema, messages: Message[], options?: CompletionOptions): Promise<T>;
    private validate;
}
