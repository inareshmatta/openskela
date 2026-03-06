"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolRegistry = void 0;
const core_1 = require("@openskela/core");
class ToolRegistry {
    static tools = new Map();
    static tool(config) {
        return (executeFn) => {
            const wrappedFn = async (args, context) => {
                // 1. Control Panel feature checks
                if (config.category === core_1.ToolCategory.TRADING && !context.controlPanel.tradingEnabled) {
                    throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', 'Trading tools are disabled. Type /enable trading');
                }
                if (config.category === core_1.ToolCategory.BROWSER && !context.controlPanel.browserEnabled) { // Assume ControlPanelSettings interface has browserEnabled if needed
                    throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', 'Browser tools are disabled. Type /enable browser');
                }
                // etc. for other feature gates...
                // 2. Execute
                return executeFn(args, context);
            };
            const fullDef = { ...config, execute: wrappedFn };
            this.tools.set(fullDef.name, fullDef);
            return fullDef;
        };
    }
    static get(toolName) {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new core_1.OpenSkeleaError('TOOL_NOT_FOUND', `Tool ${toolName} not found in registry`);
        }
        return tool;
    }
    static getAll() {
        return Array.from(this.tools.values());
    }
}
exports.ToolRegistry = ToolRegistry;
