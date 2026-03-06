export interface MarketData {
    price: number;
    volume: number;
    indicators: Record<string, number>;
}
export interface StrategySignal {
    action: 'buy' | 'sell' | 'hold' | 'short' | 'cover';
    strength: number;
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
export declare class ValueStrategy implements TradingStrategy {
    name: string;
    description: string;
    assetTypes: Array<'stock' | 'etf'>;
    timeframe: 'position';
    analyze(symbol: string, data: MarketData): Promise<StrategySignal>;
}
export declare class NewsEventStrategy implements TradingStrategy {
    name: string;
    description: string;
    assetTypes: Array<'stock' | 'crypto'>;
    timeframe: 'swing';
    analyze(symbol: string, data: MarketData): Promise<StrategySignal>;
}
