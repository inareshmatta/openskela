export interface SkillConfig {
    name: string;
    allowedDomains: string[];
}

export class SecurityScanner {
    private DANGEROUS_CODE = [/eval\s*\(/, /exec\s*\(/, /child_process/, /process\.env/, /btoa\s*\(/];
    private PROMPT_INJECTION = [/ignore previous instructions/i, /you are now/i, /new persona/i];

    async scan(code: string, config: SkillConfig): Promise<{ safe: boolean, reason?: string }> {
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
