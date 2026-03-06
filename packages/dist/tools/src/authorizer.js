"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolAuthorizer = void 0;
const core_1 = require("@openskela/core");
const registry_1 = require("./registry");
class ToolAuthorizer {
    /**
     * Check if user has permission to run a tool.
     * Checks: user permissions → org permissions → tool dangerousness → plan limits.
     * Throws TOOL_UNAUTHORIZED if not allowed — never silently skips.
     */
    async authorize(toolName, userId, organizationId, controlPanelTradingEnabled = false) {
        const tool = registry_1.ToolRegistry.get(toolName);
        // In a real implementation this would check Prisma Postgres: 
        // const userPerm = await db.userToolPermission.findUnique( ... )
        const userPerm = { allowed: true }; // MOCK for Phase 1 skeleton
        // Explicit deny
        if (userPerm?.allowed === false) {
            throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', `User does not have permission to use tool: ${toolName}`);
        }
        // Check required permission scope against org member role
        if (tool.requiredPermission && organizationId) {
            // Mocking Prisma DB org role check:
            // const member = await db.orgMember.findUnique(...) 
            const member = { permissions: ['*'] }; // MOCK
            if (!member?.permissions.includes(tool.requiredPermission) &&
                !member?.permissions.includes('*')) {
                throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', `Role does not have permission: ${tool.requiredPermission}`);
            }
        }
        // Trading tools require explicit opt-in
        if (tool.category === 'trading') {
            if (!controlPanelTradingEnabled) {
                throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', 'Trading tools are disabled. Enable in control panel or type /enable trading');
            }
        }
    }
    async logToolCall(call) {
        // Write via Prisma:
        // await db.toolAuditLog.create({ data: call })
        console.log(`[ToolAuditLog] ${call.toolName} - Success: ${call.success} - Duration: ${call.durationMs}ms`);
    }
}
exports.ToolAuthorizer = ToolAuthorizer;
