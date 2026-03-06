import type { ToolDefinition, ToolContext, ToolResult } from '@openskela/core';
export declare class ToolRegistry {
    private static tools;
    static tool(config: Omit<ToolDefinition, 'execute'>): (executeFn: (args: Record<string, unknown>, context: ToolContext) => Promise<ToolResult>) => ToolDefinition;
    static get(toolName: string): ToolDefinition;
    static getAll(): ToolDefinition[];
}
