"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMCPServer = void 0;
const core_1 = require("@openskela/core");
const base_1 = require("../base");
class DatabaseMCPServer extends base_1.MCPServerAdapter {
    serverName = 'database-mcp';
    connected = false;
    async connect() {
        console.log(`[MCP] Connecting to ${this.serverName}...`);
        this.connected = true;
    }
    async disconnect() {
        console.log(`[MCP] Disconnecting from ${this.serverName}...`);
        this.connected = false;
    }
    getTools() {
        if (!this.connected)
            return [];
        return [
            {
                name: 'mcp_db_query',
                description: 'Execute a read-only SQL query against the database via MCP',
                category: core_1.ToolCategory.MCP,
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
exports.DatabaseMCPServer = DatabaseMCPServer;
