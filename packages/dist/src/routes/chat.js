"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouteMock = chatRouteMock;
const core_1 = require("@openskela/core");
const control_panel_1 = require("@openskela/control-panel");
const settingsStore = new control_panel_1.SettingsStore();
const commandHandler = new control_panel_1.CommandHandler(settingsStore);
async function chatRouteMock(requestBody) {
    const { message, userId, sessionId } = requestBody;
    // Intercept the command before LLM
    if (control_panel_1.CommandParser.isCommand(message)) {
        const parsed = control_panel_1.CommandParser.parse(message);
        try {
            const result = await commandHandler.handle(parsed, userId);
            return {
                type: 'command_result',
                text: result.message,
                uiComponent: result.uiComponent,
                cost: 0
            };
        }
        catch (err) {
            if (err instanceof core_1.OpenSkeleaError) {
                return { type: 'error', text: err.message };
            }
            throw err;
        }
    }
    // Not a command — proceed to LLM loop
    return {
        type: 'agent_response',
        text: `Mocked agent LLM response for: ${message}`,
        cost: 0.05
    };
}
