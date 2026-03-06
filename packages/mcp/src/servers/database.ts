import { ToolCategory } from '@openskela/core';
import type { ToolDefinition } from '@openskela/core';
import { MCPServerAdapter } from '../base';

export class DatabaseMCPServer extends MCPServerAdapter {
    readonly serverName = 'database-mcp';
    private connected = false;

    async connect(): Promise<void> {
        console.log(`[MCP] Connecting to ${this.serverName}...`);
        this.connected = true;
    }

    async disconnect(): Promise<void> {
        console.log(`[MCP] Disconnecting from ${this.serverName}...`);
        this.connected = false;
    }

    getTools(): ToolDefinition[] {
        if (!this.connected) return [];

        return [
            {
                name: 'mcp_db_query',
                description: 'Execute a read-only SQL query against the database via MCP',
                category: ToolCategory.MCP,
                parameters: {
                    type: 'object',
                    properties: {
                        query: { type: 'string' }
                    },
                    required: ['query']
                },
                execute: async (args, context) => {
                    return {
                        success: true,
                        data: `[Mock] Executed query: ${args.query}`,
                    };
                }
            }
        ];
    }
}
