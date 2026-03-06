import type { UIComponent } from '@openskela/core';
import type { SettingsStore } from './settings-store';
import type { ParsedCommand } from './command-parser';
export interface CommandResult {
    success: boolean;
    message: string;
    settingChanged?: string;
    newValue?: unknown;
    uiComponent?: UIComponent;
}
export declare class CommandHandler {
    private settingsStore;
    constructor(settingsStore: SettingsStore);
    handle(command: ParsedCommand, userId: string): Promise<CommandResult>;
    private handleSet;
    private handleToggle;
    private handleStatus;
    private handleLLM;
}
