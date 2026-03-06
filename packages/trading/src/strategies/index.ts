export interface MarketData {
    price: number;
    volume: number;
    indicators: Record<string, number>;
}

export interface StrategySignal {
    action: 'buy' | 'sell' | 'hold' | 'short' | 'cover';
    strength: number; // 0-1
    reasoning: string;
    conditions: string[];
}

export interface TradingStrategy {
    name: string;
    description: string;
    assetTypes: Array<'stock' | 'crypto' | 'etf' | 'forex'>;
    timeframe: 'intraday' | 'swing' | 'position';
    analyze(symbol: string, data: MarketData): Promise<StrategySignal>;
}

// Mock implementation of a fundamental value strategy
export class ValueStrategy implements TradingStrategy {
    name = 'ValueStrategy';
    description = 'P/E, P/B, DCF undervaluation logic';
    assetTypes: Array<'stock' | 'etf'> = ['stock', 'etf'];
    timeframe: 'position' = 'position';

    async analyze(symbol: string, data: MarketData): Promise<StrategySignal> {
        return {
            action: 'hold',
            strength: 0.5,
            reasoning: 'P/E ratio within normal bounds, no clear margin of safety.',
            conditions: ['pe_normal']
        };
    }
}

// Mock implementation of an event-driven news strategy
export class NewsEventStrategy implements TradingStrategy {
    name = 'NewsEventStrategy';
    description = 'Earnings, FDA, M&A event-driven';
    assetTypes: Array<'stock' | 'crypto'> = ['stock', 'crypto'];
    timeframe: 'swing' = 'swing';

    async analyze(symbol: string, data: MarketData): Promise<StrategySignal> {
        return {
            action: 'buy',
            strength: 0.8,
            reasoning: 'Positive earnings surprise detected in recent news.',
            conditions: ['positive_earnings_surprise']
        };
    }
}
