export type WSResponseType = "error" | "response" | "alert";

export function sendWS(ws: any, type: WSResponseType, data: any) {
  ws.send(JSON.stringify({ type, data }));
}
