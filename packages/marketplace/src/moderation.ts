export type SkillReportReason = 'malicious' | 'misleading' | 'broken' | 'spam' | 'privacy_violation';

export class MarketplaceModerator {
    private reports = new Map<string, any[]>();
    private deprecated = new Set<string>();
    private removed = new Set<string>();

    async reportSkill(skillId: string, userId: string, reason: SkillReportReason, details?: string): Promise<void> {
        const existing = this.reports.get(skillId) || [];
        existing.push({ userId, reason, details, timestamp: new Date() });
        this.reports.set(skillId, existing);
    }

    async resolveReport(reportId: string, action: 'dismiss' | 'warn' | 'deprecate' | 'remove'): Promise<void> {
        // Mock resolve logic
    }

    async deprecateSkill(skillId: string, note: string): Promise<void> {
        this.deprecated.add(skillId);
    }

    async removeSkill(skillId: string, reason: string): Promise<void> {
        this.removed.add(skillId);
    }

    isRemoved(skillId: string): boolean {
        return this.removed.has(skillId);
    }

    isDeprecated(skillId: string): boolean {
        return this.deprecated.has(skillId);
    }
}
