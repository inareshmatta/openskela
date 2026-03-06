export interface ParsedCommand {
    verb: string;
    args: string[];
    raw: string;
}

export class CommandParser {
    static isCommand(input: string): boolean {
        return input.trim().startsWith('/');
    }

    static parse(input: string): ParsedCommand | null {
        const trimmed = input.trim();
        if (!trimmed.startsWith('/')) return null;

        const parts = trimmed.slice(1).split(/\s+/);
        const verb = parts[0].toLowerCase();
        const args = parts.slice(1);

        return { verb, args, raw: trimmed };
    }
}
