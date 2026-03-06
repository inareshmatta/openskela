import { OpenSkeleaError, ToolCategory } from '@openskela/core';
import type { ToolDefinition, ToolContext, ToolResult } from '@openskela/core';

export class ToolRegistry {
    private static tools: Map<string, ToolDefinition> = new Map();

    static tool(config: Omit<ToolDefinition, 'execute'>) {
        return (executeFn: (args: Record<string, unknown>, context: ToolContext) => Promise<ToolResult>) => {
            const wrappedFn = async (args: Record<string, unknown>, context: ToolContext): Promise<ToolResult> => {
                // 1. Control Panel feature checks
                if (config.category === ToolCategory.TRADING && !context.controlPanel.tradingEnabled) {
                    throw new OpenSkeleaError('TOOL_UNAUTHORIZED', 'Trading tools are disabled. Type /enable trading');
                }
                if (config.category === ToolCategory.BROWSER && !context.controlPanel.browserEnabled) { // Assume ControlPanelSettings interface has browserEnabled if needed
                    throw new OpenSkeleaError('TOOL_UNAUTHORIZED', 'Browser tools are disabled. Type /enable browser');
                }
                // etc. for other feature gates...

                // 2. Execute
                return executeFn(args, context);
            };

            const fullDef: ToolDefinition = { ...config, execute: wrappedFn };
            this.tools.set(fullDef.name, fullDef);
            return fullDef;
        };
    }

    static get(toolName: string): ToolDefinition {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new OpenSkeleaError('TOOL_NOT_FOUND', `Tool ${toolName} not found in registry`);
        }
        return tool;
    }

    static getAll(): ToolDefinition[] {
        return Array.from(this.tools.values());
    }
}
