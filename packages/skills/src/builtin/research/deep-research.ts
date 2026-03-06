import { ToolCategory } from '@openskela/core';
import type { ToolDefinition } from '@openskela/core';

export const deepResearchSkill: ToolDefinition = {
    name: 'deep-research',
    description: 'Multi-source research with citation and fact verification',
    category: ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' },
            depth: { type: 'number', default: 3 },
            format: { type: 'string', enum: ['report', 'bullets', 'summary'] }
        },
        required: ['query']
    },
    execute: async (args, context) => {
        return {
            success: true,
            data: `[Mock] Deep research generated for: ${args.query}`,
        };
    }
};
