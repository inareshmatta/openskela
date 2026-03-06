import { ToolCategory, OpenSkeleaError } from '@openskela/core';
import type { ToolResult } from '@openskela/core';
import { ToolRegistry } from '../registry';

export const amazonSearch = ToolRegistry.tool({
    name: 'amazon_search',
    description: 'Search Amazon for products',
    category: ToolCategory.SHOPPING,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query']
    }
})(async (args, context): Promise<ToolResult> => {
    if (!context.controlPanel.shoppingEnabled) {
        throw new OpenSkeleaError('TOOL_UNAUTHORIZED', 'Shopping tools are disabled.');
    }

    return {
        success: true,
        uiComponent: {
            id: 'amazon_results',
            type: 'product_grid',
            props: {
                products: [
                    { title: 'Mock Product A', price: 29.99, rating: 4.5 },
                    { title: 'Mock Product B', price: 15.00, rating: 4.0 }
                ]
            }
        }
    };
});

export const priceCompare = ToolRegistry.tool({
    name: 'price_compare',
    description: 'Compare prices across multiple platforms (Amazon, Walmart, BestBuy)',
    category: ToolCategory.SHOPPING,
    parameters: {
        type: 'object',
        properties: {
            productName: { type: 'string' }
        },
        required: ['productName']
    }
})(async (args, context): Promise<ToolResult> => {
    if (!context.controlPanel.shoppingEnabled) {
        throw new OpenSkeleaError('TOOL_UNAUTHORIZED', 'Shopping tools are disabled.');
    }

    return {
        success: true,
        uiComponent: {
            id: 'price_comparison',
            type: 'comparison_table',
            props: {
                matches: [
                    { platform: 'Amazon', price: 99.99 },
                    { platform: 'Walmart', price: 105.00 }
                ]
            }
        }
    };
});
