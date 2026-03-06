"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsStore = void 0;
const core_1 = require("@openskela/core");
class SettingsStore {
    // Mock Redis & Postgres for Phase 2 skeleton
    storage = new Map();
    async get(userId) {
        const cached = this.storage.get(userId);
        if (cached)
            return cached;
        const defaults = await this.createDefaults();
        this.storage.set(userId, defaults);
        return defaults;
    }
    async update(userId, changes) {
        const current = await this.get(userId);
        const updated = { ...current, ...changes };
        this.storage.set(userId, updated);
        return updated;
    }
    async reset(userId) {
        this.storage.delete(userId);
        return this.get(userId);
    }
    async toggle(userId, setting) {
        const current = await this.get(userId);
        const currentValue = current[setting];
        if (typeof currentValue !== 'boolean') {
            throw new core_1.OpenSkeleaError('SETTING_NOT_ALLOWED', `${String(setting)} is not a boolean toggle`);
        }
        await this.update(userId, { [setting]: !currentValue });
        return { newValue: !currentValue };
    }
    async createDefaults() {
        return {
            primaryProvider: 'claude',
            primaryModel: 'claude-3-7-sonnet-latest',
            multiLLMEnabled: true,
            reasoningEnabled: true,
            reasoningEffort: 'medium',
            memoryMode: 'hybrid',
            shortTermEnabled: true,
            longTermEnabled: true,
            vectorEnabled: true,
            graphEnabled: false,
            tradingEnabled: false,
            shoppingEnabled: true,
            appBuilderEnabled: true,
            spawningEnabled: true,
            proactiveEnabled: false,
            multimodalEnabled: true,
            voiceEnabled: false,
            browserEnabled: true,
            piiFilterEnabled: true,
            contentFilterEnabled: false,
            humanApprovalRequired: true,
            auditLogEnabled: true,
            offlineModeEnabled: false,
            maxCostPerSession: 0.50,
            maxCostPerDay: 5.00,
            costAlertAt: 0.80,
            streamingEnabled: true,
            richComponentsEnabled: true,
            thinkingDisplayEnabled: true
        };
    }
}
exports.SettingsStore = SettingsStore;
