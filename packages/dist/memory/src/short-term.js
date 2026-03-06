"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortTermMemory = void 0;
class ShortTermMemory {
    // In-memory per session
    sessions = new Map();
    async set(sessionId, key, value) {
        if (!this.sessions.has(sessionId)) {
            this.sessions.set(sessionId, new Map());
        }
        const sessionMem = this.sessions.get(sessionId);
        sessionMem.set(key, { key, value, updatedAt: new Date() });
    }
    async get(sessionId, key) {
        const sessionMem = this.sessions.get(sessionId);
        if (!sessionMem)
            return null;
        const item = sessionMem.get(key);
        return item ? item.value : null;
    }
    async clear(sessionId) {
        this.sessions.delete(sessionId);
    }
    async getAll(sessionId) {
        const sessionMem = this.sessions.get(sessionId);
        if (!sessionMem)
            return {};
        const result = {};
        for (const [key, item] of sessionMem.entries()) {
            result[key] = item.value;
        }
        return result;
    }
}
exports.ShortTermMemory = ShortTermMemory;
