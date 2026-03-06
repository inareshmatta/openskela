import { ToolCategory } from '@openskela/core';
import type { ToolResult } from '@openskela/core';
import { ToolRegistry } from '../registry';

export const webSearch = ToolRegistry.tool({
    name: 'web_search',
    description: 'Search the web using Brave Search',
    category: ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            query: { type: 'string' }
        },
        required: ['query']
    }
})(async (args, context): Promise<ToolResult> => {
    return {
        success: true,
        data: [{ title: 'Mock Result', url: 'https://example.com', snippet: 'Mock snippet' }]
    };
});

export const webScrape = ToolRegistry.tool({
    name: 'web_scrape',
    description: 'Scrape full text content from a URL',
    category: ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            url: { type: 'string' }
        },
        required: ['url']
    }
})(async (args, context): Promise<ToolResult> => {
    return {
        success: true,
        data: 'Mock scraped markdown content of the page.'
    };
});

export const screenshot = ToolRegistry.tool({
    name: 'screenshot',
    description: 'Take a screenshot of a webpage',
    category: ToolCategory.WEB,
    parameters: {
        type: 'object',
        properties: {
            url: { type: 'string' }
        },
        required: ['url']
    }
})(async (args, context): Promise<ToolResult> => {
    return {
        success: true,
        data: { base64: 'mock_base64_image_data' }
    };
});
