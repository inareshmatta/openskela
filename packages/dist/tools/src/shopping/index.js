"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceCompare = exports.amazonSearch = void 0;
const core_1 = require("@openskela/core");
const registry_1 = require("../registry");
exports.amazonSearch = registry_1.ToolRegistry.tool({
    name: 'amazon_search',
    description: 'Search Amazon for products',
    category: core_1.ToolCategory.SHOPPING,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query']
    }
})(async (args, context) => {
    if (!context.controlPanel.shoppingEnabled) {
        throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', 'Shopping tools are disabled.');
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
exports.priceCompare = registry_1.ToolRegistry.tool({
    name: 'price_compare',
    description: 'Compare prices across multiple platforms (Amazon, Walmart, BestBuy)',
    category: core_1.ToolCategory.SHOPPING,
    parameters: {
        type: 'object',
        properties: {
            productName: { type: 'string' }
        },
        required: ['productName']
    }
})(async (args, context) => {
    if (!context.controlPanel.shoppingEnabled) {
        throw new core_1.OpenSkeleaError('TOOL_UNAUTHORIZED', 'Shopping tools are disabled.');
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
