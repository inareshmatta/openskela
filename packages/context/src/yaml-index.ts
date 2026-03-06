export interface InteractionIndex {
    id: string;
    timestamp: string;
    summary: string;
    tags: string[];
}

export interface ContextIndex {
    userId: string;
    interactions: InteractionIndex[];
}

const MAX_ENTRIES = 20;
const ARCHIVE_AT = 10; // keep only this many when archiving

export class YAMLContextIndex {
    // Mock Postgres
    private storage = new Map<string, ContextIndex>();

    async load(userId: string): Promise<ContextIndex> {
        if (!this.storage.has(userId)) {
            this.storage.set(userId, { userId, interactions: [] });
        }
        return this.storage.get(userId)!;
    }

    toYAML(index: ContextIndex): string {
        if (index.interactions.length === 0) return 'No previous context.';

        const lines = ['past_interactions:'];
        for (const ix of index.interactions) {
            lines.push(`  - id: ${ix.id}`);
            lines.push(`    time: ${ix.timestamp}`);
            lines.push(`    tags: [${ix.tags.join(', ')}]`);
            lines.push(`    summary: |`);
            lines.push(`      ${ix.summary}`);
        }
        return lines.join('\n');
    }

    async addInteraction(userId: string, interaction: Omit<InteractionIndex, 'id'>): Promise<void> {
        const index = await this.load(userId);
        const id = `ix_${Math.random().toString(36).substr(2, 9)}`;
        index.interactions.push({ id, ...interaction });

        if (index.interactions.length > MAX_ENTRIES) {
            await this.archive(userId, index);
        }
    }

    async archive(userId: string, index: ContextIndex): Promise<ContextIndex> {
        // Keep only the most recent ARCHIVE_AT entries
        index.interactions = index.interactions.slice(-ARCHIVE_AT);
        this.storage.set(userId, index);
        return index;
    }

    estimateTokens(index: ContextIndex): number {
        const yaml = this.toYAML(index);
        // Rough estimate: ~4 chars per token
        return Math.ceil(yaml.length / 4);
    }
}
