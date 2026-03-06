import Ajv from 'ajv';
import { OpenSkeleaError } from '@openskela/core';
import type { JSONSchema, Message, CompletionOptions } from '@openskela/core';
import { BaseLLMAdapter } from './base';

const MAX_RETRY = 3;

export class StructuredLLM {
    private ajv: Ajv;

    constructor(private adapter: BaseLLMAdapter) {
        this.ajv = new Ajv();
    }

    /**
     * Complete with enforced JSON schema output.
     * Retries up to MAX_RETRY times if output doesn't match schema.
     * Never returns unvalidated data.
     *
     * @throws OpenSkeleaError('STRUCTURED_OUTPUT_FAILED') after MAX_RETRY
     */
    async complete<T>(
        schema: JSONSchema,
        messages: Message[],
        options?: CompletionOptions
    ): Promise<T> {
        const systemAddition = `
You MUST respond with valid JSON that matches this exact schema:
${JSON.stringify(schema, null, 2)}

Rules:
- Return ONLY the JSON object. No markdown fences. No explanation.
- All required fields must be present.
- Do not add fields not in the schema.
`;

        // Augment the first system message if it exists, otherwise prepend
        const augmentedMessages: Message[] = [...messages];
        const systemMsgIndex = augmentedMessages.findIndex(m => m.role === 'system');

        if (systemMsgIndex >= 0) {
            const origContent = typeof augmentedMessages[systemMsgIndex].content === 'string'
                ? augmentedMessages[systemMsgIndex].content
                : JSON.stringify(augmentedMessages[systemMsgIndex].content);

            augmentedMessages[systemMsgIndex] = {
                role: 'system',
                content: `${origContent}\n\n${systemAddition}`
            };
        } else {
            augmentedMessages.unshift({ role: 'system', content: systemAddition });
        }

        let lastError: string = '';

        for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
            const response = await this.adapter.complete(augmentedMessages, [], {
                ...options,
                responseSchema: schema
            });

            try {
                const text = response.text?.trim() ?? '';
                // Strip any accidental markdown fences
                const cleaned = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
                const parsed = JSON.parse(cleaned) as T;

                this.validate(parsed, schema);
                return parsed;
            } catch (err) {
                lastError = String(err);
                // On retry: tell the model what went wrong
                augmentedMessages.push(
                    { role: 'assistant', content: response.text ?? '' },
                    { role: 'user', content: `Your response was invalid. Error: ${lastError}. Please try again with valid JSON matching the schema.` }
                );
            }
        }

        throw new OpenSkeleaError(
            'STRUCTURED_OUTPUT_FAILED',
            `Failed to get valid structured output after ${MAX_RETRY} attempts: ${lastError}`,
            { schema, lastError }
        );
    }

    private validate(data: unknown, schema: JSONSchema): void {
        if (typeof data !== 'object' || data === null) {
            throw new Error('Response is not an object');
        }

        const validate = this.ajv.compile(schema);
        const valid = validate(data);

        if (!valid) {
            throw new Error(this.ajv.errorsText(validate.errors));
        }
    }
}
