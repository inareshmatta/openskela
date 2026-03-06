import { ToolCategory } from '@openskela/core';
import type { ToolResult } from '@openskela/core';
import { ToolRegistry } from '../registry';

export const storeFact = ToolRegistry.tool({
    name: 'store_fact',
    description: 'Store a fact about the user in long-term memory',
    category: ToolCategory.MEMORY,
    parameters: {
        type: 'object',
        properties: {
            fact: { type: 'string' },
            topic: { type: 'string' }
        },
        required: ['fact']
    }
})(async (args, context): Promise<ToolResult> => {
    return { success: true, data: { status: 'stored', id: 'mock_id' } };
});

export const recallFacts = ToolRegistry.tool({
    name: 'recall_facts',
    description: 'Search long-term memory for facts',
    category: ToolCategory.MEMORY,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query']
    }
})(async (args, context): Promise<ToolResult> => {
    return { success: true, data: ['User likes red', 'User is a developer'] };
});

export const forgetFact = ToolRegistry.tool({
    name: 'forget_fact',
    description: 'Forget a specific fact by ID',
    category: ToolCategory.MEMORY,
    parameters: {
        type: 'object',
        properties: {
            id: { type: 'string' }
        },
        required: ['id']
    }
})(async (args, context): Promise<ToolResult> => {
    return { success: true, data: { status: 'forgotten' } };
});
