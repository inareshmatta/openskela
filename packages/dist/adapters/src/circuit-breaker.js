"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
const FAILURE_THRESHOLD = 5; // open after N failures
const COOLDOWN_MS = 60_000; // wait 60s before half-open
const SUCCESS_THRESHOLD = 2; // close after N successes in half-open
class CircuitBreaker {
    states = new Map();
    recordFailure(provider) {
        const state = this.getState(provider);
        state.failureCount++;
        state.lastFailureAt = Date.now();
        if (state.failureCount >= FAILURE_THRESHOLD && state.state !== 'open') {
            state.state = 'open';
            state.openedAt = Date.now();
            console.warn(`[CircuitBreaker] Circuit opened for provider: ${provider}`);
        }
    }
    recordSuccess(provider) {
        const state = this.getState(provider);
        if (state.state === 'half_open') {
            state.failureCount = Math.max(0, state.failureCount - 1);
            if (state.failureCount === 0) {
                state.state = 'closed';
                console.info(`[CircuitBreaker] Circuit closed for provider: ${provider}`);
            }
        }
        else if (state.state === 'closed') {
            // Reset failure count on success when closed
            state.failureCount = 0;
        }
    }
    isOpen(provider) {
        const state = this.getState(provider);
        if (state.state === 'open') {
            // Check if cooldown passed — allow half-open probe
            if (Date.now() - (state.openedAt ?? 0) > COOLDOWN_MS) {
                state.state = 'half_open';
                // Allow a probe request through by pretending it's temporarily not fully open
                return false;
            }
            return true;
        }
        return false;
    }
    getState(provider) {
        if (!this.states.has(provider)) {
            this.states.set(provider, {
                provider,
                state: 'closed',
                failureCount: 0,
                cooldownMs: COOLDOWN_MS
            });
        }
        return this.states.get(provider);
    }
}
exports.CircuitBreaker = CircuitBreaker;
