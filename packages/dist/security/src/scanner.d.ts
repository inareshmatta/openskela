export interface SkillConfig {
    name: string;
    allowedDomains: string[];
}
export declare class SecurityScanner {
    private DANGEROUS_CODE;
    private PROMPT_INJECTION;
    scan(code: string, config: SkillConfig): Promise<{
        safe: boolean;
        reason?: string;
    }>;
}
