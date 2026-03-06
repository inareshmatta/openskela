export interface ToolCallRecord {
    userId: string;
    sessionId: string;
    agentId: string;
    toolName: string;
    args: Record<string, unknown>;
    result?: unknown;
    success: boolean;
    durationMs: number;
    error?: string;
}
export declare class ToolAuthorizer {
    /**
     * Check if user has permission to run a tool.
     * Checks: user permissions → org permissions → tool dangerousness → plan limits.
     * Throws TOOL_UNAUTHORIZED if not allowed — never silently skips.
     */
    authorize(toolName: string, userId: string, organizationId?: string, controlPanelTradingEnabled?: boolean): Promise<void>;
    logToolCall(call: ToolCallRecord): Promise<void>;
}
