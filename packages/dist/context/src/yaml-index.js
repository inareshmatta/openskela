"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YAMLContextIndex = void 0;
const MAX_ENTRIES = 20;
const ARCHIVE_AT = 10; // keep only this many when archiving
class YAMLContextIndex {
    // Mock Postgres
    storage = new Map();
    async load(userId) {
        if (!this.storage.has(userId)) {
            this.storage.set(userId, { userId, interactions: [] });
        }
        return this.storage.get(userId);
    }
    toYAML(index) {
        if (index.interactions.length === 0)
            return 'No previous context.';
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
    async addInteraction(userId, interaction) {
        const index = await this.load(userId);
        const id = `ix_${Math.random().toString(36).substr(2, 9)}`;
        index.interactions.push({ id, ...interaction });
        if (index.interactions.length > MAX_ENTRIES) {
            await this.archive(userId, index);
        }
    }
    async archive(userId, index) {
        // Keep only the most recent ARCHIVE_AT entries
        index.interactions = index.interactions.slice(-ARCHIVE_AT);
        this.storage.set(userId, index);
        return index;
    }
    estimateTokens(index) {
        const yaml = this.toYAML(index);
        // Rough estimate: ~4 chars per token
        return Math.ceil(yaml.length / 4);
    }
}
exports.YAMLContextIndex = YAMLContextIndex;
