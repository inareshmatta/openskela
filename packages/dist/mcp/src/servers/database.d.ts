import type { ToolDefinition } from '@openskela/core';
import { MCPServerAdapter } from '../base';
export declare class DatabaseMCPServer extends MCPServerAdapter {
    readonly serverName = "database-mcp";
    private connected;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getTools(): ToolDefinition[];
}
