"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentRuntimeState = exports.AgentState = void 0;
var AgentState;
(function (AgentState) {
    AgentState["IDLE"] = "idle";
    AgentState["PLANNING"] = "planning";
    AgentState["EXECUTING_TOOL"] = "executing_tool";
    AgentState["SYNTHESIZING"] = "synthesizing";
    AgentState["COMPLETE"] = "complete";
})(AgentState || (exports.AgentState = AgentState = {}));
/**
 * Agent state is ALWAYS persisted to Postgres.
 * If process crashes, agent resumes from last saved state.
 * Never trust in-memory state across restarts.
 */
class AgentRuntimeState {
    // We mock the Prisma DB interactions for Phase 1 skeleton
    storage = new Map();
    async save(sessionId, state) {
        // await db.agentRuntime.upsert(...)
        this.storage.set(sessionId, JSON.parse(JSON.stringify(state)));
    }
    async load(sessionId) {
        // const runtime = await db.agentRuntime.findUnique({ where: { sessionId } })
        const runtime = this.storage.get(sessionId);
        if (!runtime)
            return null;
        return JSON.parse(JSON.stringify(runtime));
    }
    async clear(sessionId) {
        // await db.agentRuntime.delete({ where: { sessionId } })
        this.storage.delete(sessionId);
    }
}
exports.AgentRuntimeState = AgentRuntimeState;
