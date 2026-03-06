export interface Message {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string | ContentBlock[];
    toolCallId?: string;
    toolName?: string;
}
export interface ContentBlock {
    type: 'text' | 'tool_use' | 'tool_result' | 'image' | 'thinking';
    text?: string;
    id?: string;
    name?: string;
    input?: Record<string, unknown>;
    content?: string;
    imageUrl?: string;
    thinking?: string;
}
export interface ToolCall {
    id: string;
    name: string;
    args: Record<string, unknown>;
}
export interface NormalizedToolCall {
    id: string;
    name: string;
    arguments: Record<string, unknown>;
    providerRaw: unknown;
}
export type JSONSchema = Record<string, unknown>;
export interface ToolDefinition {
    name: string;
    description: string;
    parameters: JSONSchema;
    category: ToolCategory;
    execute: (args: Record<string, unknown>, context: ToolContext) => Promise<ToolResult>;
    requiresAuth?: boolean;
    rateLimit?: number;
    timeout?: number;
    dangerous?: boolean;
    requiredPermission?: string;
    requiredLLM?: LLMProvider;
}
export interface UIComponent {
    id: string;
    type: string;
    props: Record<string, unknown>;
}
export interface ToolResult {
    success: boolean;
    data?: unknown;
    error?: string;
    tokensUsed?: number;
    uiComponent?: UIComponent;
}
export interface MemoryInterface {
    shortTerm: any;
    longTerm: any;
}
export interface Portfolio {
}
export interface UserControlPanel {
    tradingEnabled: boolean;
}
export interface ToolContext {
    userId: string;
    sessionId: string;
    agentId: string;
    organizationId?: string;
    memory: MemoryInterface;
    portfolio?: Portfolio;
    controlPanel: UserControlPanel;
}
export declare enum ToolCategory {
    WEB = "web",
    CODE = "code",
    DATA = "data",
    FILES = "files",
    MESSAGING = "messaging",
    SHOPPING = "shopping",
    TRADING = "trading",
    CALENDAR = "calendar",
    BROWSER = "browser",
    APIS = "apis",
    PAYMENTS = "payments",
    CRM = "crm",
    MEDIA = "media",
    VOICE = "voice",
    MEMORY = "memory",
    APP_BUILDER = "app_builder",
    MCP = "mcp"
}
export type LLMProvider = 'claude' | 'openai' | 'gemini' | 'grok' | 'ollama' | 'custom';
export type TaskType = 'code_generation' | 'code_review' | 'writing' | 'trading_analysis' | 'trading_news' | 'shopping_search' | 'image_analysis' | 'frontend_generation' | 'document_analysis' | 'embeddings' | 'voice_transcription' | 'private_data' | 'security_review' | 'general';
export interface TokenUsage {
    inputTokens: number;
    outputTokens: number;
    reasoningTokens?: number;
    cacheReadTokens?: number;
    cacheWriteTokens?: number;
}
export interface AgentResponse {
    text?: string;
    toolCall?: NormalizedToolCall;
    usage: TokenUsage;
    cost: number;
    provider: LLMProvider;
    model: string;
    latencyMs: number;
    raw: unknown;
}
export interface CompletionOptions {
    temperature?: number;
    maxTokens?: number;
    taskType?: TaskType;
    reasoning?: {
        enabled: boolean;
        effort: 'low' | 'medium' | 'high';
        mode?: 'interleaved' | 'batch';
    };
    cacheControl?: boolean;
    forceProvider?: LLMProvider;
    responseSchema?: JSONSchema;
}
export declare class OpenSkeleaError extends Error {
    code: string;
    context?: any | undefined;
    constructor(code: string, message: string, context?: any | undefined);
}
