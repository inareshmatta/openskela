"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityScanner = void 0;
class SecurityScanner {
    DANGEROUS_CODE = [/eval\s*\(/, /exec\s*\(/, /child_process/, /process\.env/, /btoa\s*\(/];
    PROMPT_INJECTION = [/ignore previous instructions/i, /you are now/i, /new persona/i];
    async scan(code, config) {
        for (const pattern of this.DANGEROUS_CODE) {
            if (pattern.test(code)) {
                return { safe: false, reason: `Matches dangerous code pattern: ${pattern.source}` };
            }
        }
        for (const pattern of this.PROMPT_INJECTION) {
            if (pattern.test(code)) {
                return { safe: false, reason: `Matches prompt injection pattern: ${pattern.source}` };
            }
        }
        return { safe: true };
    }
}
exports.SecurityScanner = SecurityScanner;
