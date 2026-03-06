"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StructuredLogger = void 0;
class StructuredLogger {
    context;
    constructor(context) {
        this.context = context;
    }
    write(level, event, message, data) {
        const entry = {
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
    info(event, message, data) {
        this.write('info', event, message, data);
    }
    warn(event, message, data) {
        this.write('warn', event, message, data);
    }
    error(event, message, error, data) {
        this.write('error', event, message, {
            ...data,
            error: error?.message,
            stack: error?.stack
        });
    }
    debug(event, message, data) {
        this.write('debug', event, message, data);
    }
}
exports.StructuredLogger = StructuredLogger;
