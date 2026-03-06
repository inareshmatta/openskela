import type { ToolDefinition } from '@openskela/core';
import { MCPServerAdapter } from './base';

export class MCPRegistry {
    private static adapters: Map<string, MCPServerAdapter> = new Map();

    static register(adapter: MCPServerAdapter): void {
        this.adapters.set(adapter.serverName, adapter);
    }

    static async connect(serverName: string): Promise<void> {
        const adapter = this.adapters.get(serverName);
        if (adapter) {
            await adapter.connect();
        }
    }

    static getTools(serverName?: string): ToolDefinition[] {
        if (serverName) {
            const adapter = this.adapters.get(serverName);
            return adapter ? adapter.getTools() : [];
        }

        let allTools: ToolDefinition[] = [];
        for (const adapter of this.adapters.values()) {
            allTools = allTools.concat(adapter.getTools());
        }
        return allTools;
    }
}
