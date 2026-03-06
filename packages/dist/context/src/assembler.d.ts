import type { ContextIndex } from './yaml-index';
export interface ContextNeeds {
    needsFullInteraction?: boolean;
    needsLongTerm?: boolean;
    needsVector?: boolean;
    interactionIds?: string[];
    fidelity?: 'short' | 'medium' | 'full';
}
export declare class ContextAssembler {
    classifyContextNeeds(query: string, index: ContextIndex): ContextNeeds;
    assemble(query: string, indexStr: string, needs: ContextNeeds): string;
}
