import type { ToolDefinition } from '@openskela/core';
import { MCPServerAdapter } from './base';
export declare class MCPRegistry {
    private static adapters;
    static register(adapter: MCPServerAdapter): void;
    static connect(serverName: string): Promise<void>;
    static getTools(serverName?: string): ToolDefinition[];
}
