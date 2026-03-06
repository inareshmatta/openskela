export interface InteractionIndex {
    id: string;
    timestamp: string;
    summary: string;
    tags: string[];
}
export interface ContextIndex {
    userId: string;
    interactions: InteractionIndex[];
}
export declare class YAMLContextIndex {
    private storage;
    load(userId: string): Promise<ContextIndex>;
    toYAML(index: ContextIndex): string;
    addInteraction(userId: string, interaction: Omit<InteractionIndex, 'id'>): Promise<void>;
    archive(userId: string, index: ContextIndex): Promise<ContextIndex>;
    estimateTokens(index: ContextIndex): number;
}
