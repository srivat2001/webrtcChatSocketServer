import { WebSocket } from "ws";
import { roomdata } from "../rooms/store";
import { sendWS } from "../utils/response";
export function getRoomData(ws: WebSocket) {
  ws.on("message", (msg: string) => {
    const { roomname } = JSON.parse(msg);
    if (!roomname) return sendWS(ws, "error", "room-not-found");
    if (!roomdata[roomname]) return sendWS(ws, "error", "room-not-found");
    const { offererWS, answererWS, ...clean } = roomdata[roomname];
    sendWS(ws, "response", { status: "offerdata_fetched", roomdata: clean });
  });
}
