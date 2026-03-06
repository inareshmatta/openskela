"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPRegistry = void 0;
class MCPRegistry {
    static adapters = new Map();
    static register(adapter) {
        this.adapters.set(adapter.serverName, adapter);
    }
    static async connect(serverName) {
        const adapter = this.adapters.get(serverName);
        if (adapter) {
            await adapter.connect();
        }
    }
    static getTools(serverName) {
        if (serverName) {
            const adapter = this.adapters.get(serverName);
            return adapter ? adapter.getTools() : [];
        }
        let allTools = [];
        for (const adapter of this.adapters.values()) {
            allTools = allTools.concat(adapter.getTools());
        }
        return allTools;
    }
}
exports.MCPRegistry = MCPRegistry;
