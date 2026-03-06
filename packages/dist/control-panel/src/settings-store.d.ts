import type { ControlPanelSettings } from '@openskela/core';
export declare class SettingsStore {
    private storage;
    get(userId: string): Promise<ControlPanelSettings>;
    update(userId: string, changes: Partial<ControlPanelSettings>): Promise<ControlPanelSettings>;
    reset(userId: string): Promise<ControlPanelSettings>;
    toggle(userId: string, setting: keyof ControlPanelSettings): Promise<{
        newValue: boolean;
    }>;
    private createDefaults;
}
