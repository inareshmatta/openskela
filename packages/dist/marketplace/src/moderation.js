"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceModerator = void 0;
class MarketplaceModerator {
    reports = new Map();
    deprecated = new Set();
    removed = new Set();
    async reportSkill(skillId, userId, reason, details) {
        const existing = this.reports.get(skillId) || [];
        existing.push({ userId, reason, details, timestamp: new Date() });
        this.reports.set(skillId, existing);
    }
    async resolveReport(reportId, action) {
        // Mock resolve logic
    }
    async deprecateSkill(skillId, note) {
        this.deprecated.add(skillId);
    }
    async removeSkill(skillId, reason) {
        this.removed.add(skillId);
    }
    isRemoved(skillId) {
        return this.removed.has(skillId);
    }
    isDeprecated(skillId) {
        return this.deprecated.has(skillId);
    }
}
exports.MarketplaceModerator = MarketplaceModerator;
