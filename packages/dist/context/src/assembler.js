"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextAssembler = void 0;
class ContextAssembler {
    classifyContextNeeds(query, index) {
        const q = query.toLowerCase();
        // 1. Explicit reference keywords
        const explicitRefs = [
            'earlier', 'before', 'last time', 'you said', 'we discussed',
            'that code', 'resume', 'continue', 'where we left off', 'fix that'
        ];
        if (explicitRefs.some(kw => q.includes(kw))) {
            return { needsFullInteraction: true, fidelity: 'full' };
        }
        // 2. Pronoun + technical noun
        const pronounTech = /\b(fix|update|change|improve|that|the|it)\b.*\b(function|config|code|query|script|file|class)\b/;
        if (pronounTech.test(q)) {
            return { needsFullInteraction: true, fidelity: 'medium' };
        }
        // 3. Tag overlap scoring
        const queryWords = new Set(q.split(/\s+/).filter(w => w.length > 3));
        const overlapping = index.interactions.filter(ix => ix.tags.some(tag => queryWords.has(tag.toLowerCase())));
        if (overlapping.length > 0) {
            return {
                needsLongTerm: true,
                interactionIds: overlapping.map((i) => i.id),
                fidelity: 'short'
            };
        }
        // 4. Default: No heavy context needed immediately
        return { needsLongTerm: false, needsVector: false };
    }
    assemble(query, indexStr, needs) {
        const lines = ['<system_context>'];
        lines.push('<yaml_index>');
        lines.push(indexStr);
        lines.push('</yaml_index>');
        if (needs.needsFullInteraction) {
            lines.push('<interaction_injections>');
            lines.push('  Mock full interaction logs retrieved dynamically.');
            lines.push('</interaction_injections>');
        }
        lines.push('</system_context>');
        return lines.join('\n');
    }
}
exports.ContextAssembler = ContextAssembler;
