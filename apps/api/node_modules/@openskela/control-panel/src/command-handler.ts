import { OpenSkeleaError } from '@openskela/core';
import type { ControlPanelSettings, LLMProvider, UIComponent } from '@openskela/core';
import type { SettingsStore } from './settings-store';
import type { ParsedCommand } from './command-parser';

export interface CommandResult {
    success: boolean;
    message: string;
    settingChanged?: string;
    newValue?: unknown;
    uiComponent?: UIComponent;
}

export class CommandHandler {
    constructor(private settingsStore: SettingsStore) { }

    async handle(command: ParsedCommand, userId: string): Promise<CommandResult> {
        switch (command.verb) {
            case 'set':
                return this.handleSet(command.args, userId);
            case 'enable':
                return this.handleToggle(command.args[0], true, userId);
            case 'disable':
                return this.handleToggle(command.args[0], false, userId);
            case 'status':
                return this.handleStatus(userId);
            case 'cost':
                return { success: true, message: 'Current cost: $0.10 / $5.00 limit' }; // Mock
            case 'reset':
                if (command.args[0] === 'settings') {
                    await this.settingsStore.reset(userId);
                    return { success: true, message: 'Settings reset to default' };
                }
                throw new OpenSkeleaError('COMMAND_UNKNOWN', 'Usage: /reset settings');
            case 'llm':
                return this.handleLLM(command.args);
            case 'help':
                return { success: true, message: 'Commands: /set, /enable, /disable, /status, /reset config' };
            default:
                throw new OpenSkeleaError('COMMAND_UNKNOWN', `Unknown command: /${command.verb}`);
        }
    }

    private async handleSet(args: string[], userId: string): Promise<CommandResult> {
        if (args.length < 2) throw new OpenSkeleaError('COMMAND_INVALID_ARGS', 'Usage: /set <setting> <value>');
        const [setting, ...valueParts] = args;
        const value = valueParts.join(' ');

        const mapping: Record<string, (v: string) => Partial<ControlPanelSettings>> = {
            'model': (v) => {
                const [provider, ...rest] = v.split('/');
                return { primaryProvider: provider as LLMProvider, primaryModel: rest.join('/') || provider };
            },
            'reasoning': (v) => ({ reasoningEffort: v as any }),
            'cost-limit': (v) => ({ maxCostPerSession: parseFloat(v) }),
            'memory': (v) => ({ memoryMode: v })
        };

        const mapper = mapping[setting];
        if (!mapper) throw new OpenSkeleaError('COMMAND_INVALID_ARGS', `Unknown setting: ${setting}`);

        const changes = mapper(value);
        await this.settingsStore.update(userId, changes);

        return {
            success: true,
            message: `✅ ${setting} set to ${value}`,
            settingChanged: setting,
            newValue: value
        };
    }

    private async handleToggle(feature: string, enabled: boolean, userId: string): Promise<CommandResult> {
        if (!feature) throw new OpenSkeleaError('COMMAND_INVALID_ARGS', 'Usage: /enable <feature>');

        const map: Record<string, keyof ControlPanelSettings> = {
            'trading': 'tradingEnabled',
            'shopping': 'shoppingEnabled',
            'spawning': 'spawningEnabled',
            'voice': 'voiceEnabled',
            'browser': 'browserEnabled',
            'reasoning': 'reasoningEnabled'
        };

        const key = map[feature];
        if (!key) throw new OpenSkeleaError('COMMAND_INVALID_ARGS', `Unknown feature: ${feature}`);

        await this.settingsStore.update(userId, { [key]: enabled } as any);
        return {
            success: true,
            message: `${enabled ? '✅ Enabled' : '⛔ Disabled'} ${feature}`
        };
    }

    private async handleStatus(userId: string): Promise<CommandResult> {
        const settings = await this.settingsStore.get(userId);
        return {
            success: true,
            message: 'Current Configuration',
            uiComponent: {
                id: 'settings_ui',
                type: 'control_panel',
                props: { settings }
            }
        };
    }

    private async handleLLM(args: string[]): Promise<CommandResult> {
        if (args[0] === 'list') {
            return { success: true, message: 'Providers: claude, openai, gemini, grok, ollama' };
        }
        return { success: true, message: 'Usage: /llm list | /llm add <provider>' };
    }
}
