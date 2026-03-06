"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandParser = void 0;
class CommandParser {
    static isCommand(input) {
        return input.trim().startsWith('/');
    }
    static parse(input) {
        const trimmed = input.trim();
        if (!trimmed.startsWith('/'))
            return null;
        const parts = trimmed.slice(1).split(/\s+/);
        const verb = parts[0].toLowerCase();
        const args = parts.slice(1);
        return { verb, args, raw: trimmed };
    }
}
exports.CommandParser = CommandParser;
