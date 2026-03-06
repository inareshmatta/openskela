import { StructuredLLM } from '@openskela/adapters';
export interface TradeDecision {
    action: 'buy' | 'sell' | 'hold' | 'short' | 'cover';
    confidence: number;
    reasoning: string;
    stopLoss?: number;
    takeProfit?: number;
}
export declare class TradingConsensus {
    private structuredLLM;
    constructor(structuredLLM: StructuredLLM);
    analyze(symbol: string): Promise<TradeDecision>;
    private getMockMarketData;
}
