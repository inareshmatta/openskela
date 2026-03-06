"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.screenshot = exports.webScrape = exports.webSearch = void 0;
const core_1 = require("@openskela/core");
const registry_1 = require("../registry");
exports.webSearch = registry_1.ToolRegistry.tool({
    name: 'web_search',
    description: 'Search the web using Brave Search',
    category: core_1.ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query']
    }
})(async (args, context) => {
    return {
        success: true,
        data: [{ title: 'Mock Result', url: 'https://example.com', snippet: 'Mock snippet' }]
    };
});
exports.webScrape = registry_1.ToolRegistry.tool({
    name: 'web_scrape',
    description: 'Scrape full text content from a URL',
    category: core_1.ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            url: { type: 'string' }
        },
        required: ['url']
    }
})(async (args, context) => {
    return {
        success: true,
        data: 'Mock scraped markdown content of the page.'
    };
});
exports.screenshot = registry_1.ToolRegistry.tool({
    name: 'screenshot',
    description: 'Take a screenshot of a webpage',
    category: core_1.ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            url: { type: 'string' }
        },
        required: ['url']
    }
})(async (args, context) => {
    return {
        success: true,
        data: { base64: 'mock_base64_image_data' }
    };
});
