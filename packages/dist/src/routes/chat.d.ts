export interface ChatRequest {
    message: string;
    userId: string;
    sessionId: string;
}
export declare function chatRouteMock(requestBody: ChatRequest): Promise<{
    type: string;
    text: string;
    uiComponent: import("@openskela/core").UIComponent | undefined;
    cost: number;
} | {
    type: string;
    text: string;
    uiComponent?: undefined;
    cost?: undefined;
} | {
    type: string;
    text: string;
    cost: number;
    uiComponent?: undefined;
}>;
