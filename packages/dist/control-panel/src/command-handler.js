"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandHandler = void 0;
const core_1 = require("@openskela/core");
class CommandHandler {
    settingsStore;
    constructor(settingsStore) {
        this.settingsStore = settingsStore;
    }
    async handle(command, userId) {
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
                throw new core_1.OpenSkeleaError('COMMAND_UNKNOWN', 'Usage: /reset settings');
            case 'llm':
                return this.handleLLM(command.args);
            case 'help':
                return { success: true, message: 'Commands: /set, /enable, /disable, /status, /reset config' };
            default:
                throw new core_1.OpenSkeleaError('COMMAND_UNKNOWN', `Unknown command: /${command.verb}`);
        }
    }
    async handleSet(args, userId) {
        if (args.length < 2)
            throw new core_1.OpenSkeleaError('COMMAND_INVALID_ARGS', 'Usage: /set <setting> <value>');
        const [setting, ...valueParts] = args;
        const value = valueParts.join(' ');
        const mapping = {
            'model': (v) => {
                const [provider, ...rest] = v.split('/');
                return { primaryProvider: provider, primaryModel: rest.join('/') || provider };
            },
            'reasoning': (v) => ({ reasoningEffort: v }),
            'cost-limit': (v) => ({ maxCostPerSession: parseFloat(v) }),
            'memory': (v) => ({ memoryMode: v })
        };
        const mapper = mapping[setting];
        if (!mapper)
            throw new core_1.OpenSkeleaError('COMMAND_INVALID_ARGS', `Unknown setting: ${setting}`);
        const changes = mapper(value);
        await this.settingsStore.update(userId, changes);
        return {
            success: true,
            message: `✅ ${setting} set to ${value}`,
            settingChanged: setting,
            newValue: value
        };
    }
    async handleToggle(feature, enabled, userId) {
        if (!feature)
            throw new core_1.OpenSkeleaError('COMMAND_INVALID_ARGS', 'Usage: /enable <feature>');
        const map = {
            'trading': 'tradingEnabled',
            'shopping': 'shoppingEnabled',
            'spawning': 'spawningEnabled',
            'voice': 'voiceEnabled',
            'browser': 'browserEnabled',
            'reasoning': 'reasoningEnabled'
        };
        const key = map[feature];
        if (!key)
            throw new core_1.OpenSkeleaError('COMMAND_INVALID_ARGS', `Unknown feature: ${feature}`);
        await this.settingsStore.update(userId, { [key]: enabled });
        return {
            success: true,
            message: `${enabled ? '✅ Enabled' : '⛔ Disabled'} ${feature}`
        };
    }
    async handleStatus(userId) {
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
    async handleLLM(args) {
        if (args[0] === 'list') {
            return { success: true, message: 'Providers: claude, openai, gemini, grok, ollama' };
        }
        return { success: true, message: 'Usage: /llm list | /llm add <provider>' };
    }
}
exports.CommandHandler = CommandHandler;
