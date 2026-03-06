"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepResearchSkill = void 0;
const core_1 = require("@openskela/core");
exports.deepResearchSkill = {
    name: 'deep-research',
    description: 'Multi-source research with citation and fact verification',
    category: core_1.ToolCategory.WEB,
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
