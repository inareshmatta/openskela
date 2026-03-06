import type { LLMProvider } from './types';

export interface ControlPanelSettings {
    primaryProvider: LLMProvider;
    primaryModel: string;
    multiLLMEnabled: boolean;
    reasoningEnabled: boolean;
    reasoningEffort: 'auto' | 'low' | 'medium' | 'high';

    memoryMode: string;
    shortTermEnabled: boolean;
    longTermEnabled: boolean;
    vectorEnabled: boolean;
    graphEnabled: boolean;

    tradingEnabled: boolean;
    shoppingEnabled: boolean;
    appBuilderEnabled: boolean;
    spawningEnabled: boolean;
    proactiveEnabled: boolean;
    multimodalEnabled: boolean;
    voiceEnabled: boolean;
    browserEnabled: boolean;

    piiFilterEnabled: boolean;
    contentFilterEnabled: boolean;
    humanApprovalRequired: boolean;
    auditLogEnabled: boolean;
    offlineModeEnabled: boolean;

    maxCostPerSession: number;
    maxCostPerDay: number;
    costAlertAt: number;

    streamingEnabled: boolean;
    richComponentsEnabled: boolean;
    thinkingDisplayEnabled: boolean;
}
