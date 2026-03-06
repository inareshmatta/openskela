export type SkillReportReason = 'malicious' | 'misleading' | 'broken' | 'spam' | 'privacy_violation';
export declare class MarketplaceModerator {
    private reports;
    private deprecated;
    private removed;
    reportSkill(skillId: string, userId: string, reason: SkillReportReason, details?: string): Promise<void>;
    resolveReport(reportId: string, action: 'dismiss' | 'warn' | 'deprecate' | 'remove'): Promise<void>;
    deprecateSkill(skillId: string, note: string): Promise<void>;
    removeSkill(skillId: string, reason: string): Promise<void>;
    isRemoved(skillId: string): boolean;
    isDeprecated(skillId: string): boolean;
}
