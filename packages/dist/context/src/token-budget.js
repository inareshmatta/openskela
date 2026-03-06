"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBudget = void 0;
class TokenBudget {
    RESERVED = {
        systemPrompt: 500,
        yamlIndex: 400,
        outputBuffer: 2000,
        workingMemory: 300,
    };
    available(totalModelLimit) {
        const reservedTotal = Object.values(this.RESERVED).reduce((a, b) => a + b, 0);
        return totalModelLimit - reservedTotal;
    }
    compress(messages, maxTokens) {
        // Rough simulation of token counting (characters / 4)
        const countTokens = (msg) => typeof msg.content === 'string' ? Math.ceil(msg.content.length / 4) : 50;
        let currentTokens = messages.reduce((acc, msg) => acc + countTokens(msg), 0);
        if (currentTokens <= maxTokens) {
            return messages;
        }
        // Compress by keeping first (system) and last N messages
        const compressed = [];
        if (messages.length > 0 && messages[0].role === 'system') {
            compressed.push(messages[0]);
        }
        // Retain from the end until we hit budget
        const endChunk = [];
        let budgetLeft = maxTokens - (compressed.length > 0 ? countTokens(compressed[0]) : 0);
        for (let i = messages.length - 1; i >= Math.max(1, messages.length - 10); i--) {
            const msg = messages[i];
            const tokens = countTokens(msg);
            if (budgetLeft - tokens > 0) {
                endChunk.unshift(msg);
                budgetLeft -= tokens;
            }
            else {
                break; // out of budget
            }
        }
        // Insert a dummy compression notice in the middle
        if (compressed.length + endChunk.length < messages.length) {
            compressed.push({
                role: 'system',
                content: `... [${messages.length - compressed.length - endChunk.length} messages omitted due to token limit] ...`
            });
        }
        return [...compressed, ...endChunk];
    }
}
exports.TokenBudget = TokenBudget;
