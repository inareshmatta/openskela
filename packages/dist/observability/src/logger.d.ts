export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export interface LogEntry {
    level: LogLevel;
    timestamp: string;
    traceId?: string;
    userId?: string;
    organizationId?: string;
    event: string;
    message: string;
    metadata?: Record<string, any>;
    durationMs?: number;
    error?: string;
    stack?: string;
}
export declare class StructuredLogger {
    private context;
    constructor(context: {
        component: string;
    });
    private write;
    info(event: string, message: string, data?: Partial<LogEntry>): void;
    warn(event: string, message: string, data?: Partial<LogEntry>): void;
    error(event: string, message: string, error?: Error, data?: Partial<LogEntry>): void;
    debug(event: string, message: string, data?: Partial<LogEntry>): void;
}
