export class RateLimiter {
    private store = new Map<string, { count: number; resetAt: number }>();

    constructor(private limits: { maxRequests: number; windowMs: number }) { }

    async check(key: string): Promise<{ allowed: boolean; retryAfter?: number }> {
        const now = Date.now();
        const current = this.store.get(key) || { count: 0, resetAt: now + this.limits.windowMs };

        if (now > current.resetAt) {
            current.count = 0;
            current.resetAt = now + this.limits.windowMs;
        }

        if (current.count >= this.limits.maxRequests) {
            return { allowed: false, retryAfter: current.resetAt - now };
        }

        current.count++;
        this.store.set(key, current);

        return { allowed: true };
    }
}
