import { StructuredLLM } from '@openskela/adapters';
import type { MarketData } from './strategies';

export interface TradeDecision {
    action: 'buy' | 'sell' | 'hold' | 'short' | 'cover';
    confidence: number;
    reasoning: string;
    stopLoss?: number;
    takeProfit?: number;
}

export class TradingConsensus {
    constructor(private structuredLLM: StructuredLLM) { }

    async analyze(symbol: string): Promise<TradeDecision> {
        const marketData = await this.getMockMarketData(symbol);
        const fundamentals = "Mock positive revenue growth, debt reduced by 10%.";
        const sentiment = "Mock extremely bullish sentiment on Twitter regarding upcoming product launch.";

        // 1. Claude: Deep Fundamental & Technical Analysis
        const claudeSchema = {
            type: 'object',
            required: ['action', 'confidence', 'technical', 'fundamental', 'risks'],
            properties: {
                action: { type: 'string', enum: ['buy', 'sell', 'hold', 'short', 'cover'] },
                confidence: { type: 'number', minimum: 0, maximum: 1 },
                technical: { type: 'string' },
                fundamental: { type: 'string' },
                risks: { type: 'array', items: { type: 'string' } },
                stopLoss: { type: 'number' },
                takeProfit: { type: 'number' }
            }
        };

        const claudeDecision = await this.structuredLLM.complete<any>(
            claudeSchema,
            [{ role: 'user', content: `Analyze ${symbol}. Data: ${JSON.stringify(marketData)}. Fundamentals: ${fundamentals}` }],
            { forceProvider: 'claude', reasoning: { enabled: true, effort: 'high' } }
        );

        // 2. Grok: Real-time News & Social Sentiment Analysis
        const grokSchema = {
            type: 'object',
            required: ['action', 'confidence', 'sentimentStrength', 'catalysts'],
            properties: {
                action: { type: 'string', enum: ['buy', 'sell', 'hold', 'short', 'cover'] },
                confidence: { type: 'number', minimum: 0, maximum: 1 },
                sentimentStrength: { type: 'number', minimum: -1, maximum: 1 },
                catalysts: { type: 'array', items: { type: 'string' } }
            }
        };

        const grokDecision = await this.structuredLLM.complete<any>(
            grokSchema,
            [{ role: 'user', content: `Evaluate short term sentiment for ${symbol}. Context: ${sentiment}` }],
            { forceProvider: 'grok', reasoning: { enabled: true, effort: 'medium' } }
        );

        // 3. Consensus Logic: Both must agree on direction
        if (claudeDecision.action !== grokDecision.action) {
            return {
                action: 'hold',
                confidence: 0,
                reasoning: `Disagreement: Claude says ${claudeDecision.action}, Grok says ${grokDecision.action}`
            };
        }

        return {
            action: claudeDecision.action,
            confidence: Math.min(claudeDecision.confidence, grokDecision.confidence),
            reasoning: `Consensus reached. Claude: ${claudeDecision.fundamental}. Grok: Catalysts detected.`,
            stopLoss: claudeDecision.stopLoss,
            takeProfit: claudeDecision.takeProfit
        };
    }

    private async getMockMarketData(symbol: string): Promise<MarketData> {
        return {
            price: 150.00,
            volume: 1200000,
            indicators: { rsi: 45, macd: 0.5 }
        };
    }
}
