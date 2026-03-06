import type { LongTermMemory } from './long-term';
import type { VectorMemory } from './vector';
import type { GraphMemory } from './graph';
export declare class RetentionManager {
    private longTerm;
    private vector;
    private graph;
    constructor(longTerm: LongTermMemory, vector: VectorMemory, graph: GraphMemory);
    enforceRetention(): Promise<void>;
    forgetUser(userId: string): Promise<void>;
}
