import { StructuredLLM } from '@openskela/adapters';
export declare class AppBuilderAgent {
    private llm;
    private readonly MAX_ITERATIONS;
    constructor(llm: StructuredLLM);
    build(prompt: string): Promise<string>;
}
