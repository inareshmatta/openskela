export interface ParsedCommand {
    verb: string;
    args: string[];
    raw: string;
}
export declare class CommandParser {
    static isCommand(input: string): boolean;
    static parse(input: string): ParsedCommand | null;
}
