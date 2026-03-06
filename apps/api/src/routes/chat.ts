import { OpenSkeleaError } from '@openskela/core';
import { CommandParser, CommandHandler, SettingsStore } from '@openskela/control-panel';

const settingsStore = new SettingsStore();
const commandHandler = new CommandHandler(settingsStore);

export interface ChatRequest {
    message: string;
    userId: string;
    sessionId: string;
}

export async function chatRouteMock(requestBody: ChatRequest) {
    const { message, userId, sessionId } = requestBody;

    // Intercept the command before LLM
    if (CommandParser.isCommand(message)) {
        const parsed = CommandParser.parse(message)!;
        try {
            const result = await commandHandler.handle(parsed, userId);
            return {
                type: 'command_result',
                text: result.message,
                uiComponent: result.uiComponent,
                cost: 0
            };
        } catch (err) {
            if (err instanceof OpenSkeleaError) {
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
