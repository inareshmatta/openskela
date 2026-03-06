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

export class StructuredLogger {
    constructor(private context: { component: string }) { }

    private write(level: LogLevel, event: string, message: string, data?: Partial<LogEntry>) {
        const entry: LogEntry = {
            level,
            timestamp: new Date().toISOString(),
            event,
            message,
            metadata: { component: this.context.component, ...(data?.metadata || {}) },
            ...data
        };

        // In production, this would pipe to stdout for a log aggregator to collect.
        console.log(JSON.stringify(entry));
    }

    info(event: string, message: string, data?: Partial<LogEntry>) {
        this.write('info', event, message, data);
    }

    warn(event: string, message: string, data?: Partial<LogEntry>) {
        this.write('warn', event, message, data);
    }

    error(event: string, message: string, error?: Error, data?: Partial<LogEntry>) {
        this.write('error', event, message, {
            ...data,
            error: error?.message,
            stack: error?.stack
        });
    }

    debug(event: string, message: string, data?: Partial<LogEntry>) {
        this.write('debug', event, message, data);
    }
}
