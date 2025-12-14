export type WSResponseType = "error" | "response" | "alert";
export declare function sendWS(ws: any, type: WSResponseType, data: any): void;
