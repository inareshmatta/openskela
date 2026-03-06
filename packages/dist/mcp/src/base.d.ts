import type { ToolDefinition } from '@openskela/core';
export declare abstract class MCPServerAdapter {
    abstract readonly serverName: string;
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract getTools(): ToolDefinition[];
}
