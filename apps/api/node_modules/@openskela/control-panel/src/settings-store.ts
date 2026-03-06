import type { ControlPanelSettings } from '@openskela/core';
import { OpenSkeleaError } from '@openskela/core';

export class SettingsStore {
    // Mock Redis & Postgres for Phase 2 skeleton
    private storage: Map<string, ControlPanelSettings> = new Map();

    async get(userId: string): Promise<ControlPanelSettings> {
        const cached = this.storage.get(userId);
        if (cached) return cached;

        const defaults = await this.createDefaults();
        this.storage.set(userId, defaults);
        return defaults;
    }

    async update(userId: string, changes: Partial<ControlPanelSettings>): Promise<ControlPanelSettings> {
        const current = await this.get(userId);
        const updated = { ...current, ...changes };
        this.storage.set(userId, updated);
        return updated;
    }

    async reset(userId: string): Promise<ControlPanelSettings> {
        this.storage.delete(userId);
        return this.get(userId);
    }

    async toggle(userId: string, setting: keyof ControlPanelSettings): Promise<{ newValue: boolean }> {
        const current = await this.get(userId);
        const currentValue = current[setting];

        if (typeof currentValue !== 'boolean') {
            throw new OpenSkeleaError('SETTING_NOT_ALLOWED', `${String(setting)} is not a boolean toggle`);
        }

        await this.update(userId, { [setting]: !currentValue } as Partial<ControlPanelSettings>);
        return { newValue: !currentValue };
    }

    private async createDefaults(): Promise<ControlPanelSettings> {
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
