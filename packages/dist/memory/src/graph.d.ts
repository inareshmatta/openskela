export interface GraphNode {
    id: string;
    label: string;
    properties: Record<string, unknown>;
}
export interface GraphEdge {
    id: string;
    fromId: string;
    toId: string;
    relation: string;
    properties: Record<string, unknown>;
}
export declare class GraphMemory {
    private nodes;
    private edges;
    addNode(label: string, properties: Record<string, unknown>): Promise<string>;
    addEdge(fromId: string, toId: string, relation: string, properties?: Record<string, unknown>): Promise<string>;
    query(cypherQuery: string, params: Record<string, unknown>): Promise<unknown[]>;
}
