"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgetFact = exports.recallFacts = exports.storeFact = void 0;
const core_1 = require("@openskela/core");
const registry_1 = require("../registry");
exports.storeFact = registry_1.ToolRegistry.tool({
    name: 'store_fact',
    description: 'Store a fact about the user in long-term memory',
    category: core_1.ToolCategory.MEMORY,
    parameters: {
        type: 'object',
        properties: {
            fact: { type: 'string' },
            topic: { type: 'string' }
        },
        required: ['fact']
    }
})(async (args, context) => {
    return { success: true, data: { status: 'stored', id: 'mock_id' } };
});
exports.recallFacts = registry_1.ToolRegistry.tool({
    name: 'recall_facts',
    description: 'Search long-term memory for facts',
    category: core_1.ToolCategory.MEMORY,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query']
    }
})(async (args, context) => {
    return { success: true, data: ['User likes red', 'User is a developer'] };
});
exports.forgetFact = registry_1.ToolRegistry.tool({
    name: 'forget_fact',
    description: 'Forget a specific fact by ID',
    category: core_1.ToolCategory.MEMORY,
    parameters: {
        type: 'object',
        properties: {
            id: { type: 'string' }
        },
        required: ['id']
    }
})(async (args, context) => {
    return { success: true, data: { status: 'forgotten' } };
});
