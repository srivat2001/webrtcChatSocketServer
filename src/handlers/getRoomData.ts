import { WebSocket } from "ws";
import { roomdata } from "../rooms/store";
import { sendWS } from "../utils/response";
export function getRoomData(ws: WebSocket) {
  ws.on("message", (msg: string) => {
    const { roomname } = JSON.parse(msg);
    if (!roomname) return sendWS(ws, "error", "roomname is required");
    if (!roomdata[roomname]) return sendWS(ws, "error", "Room not found");
    const { offererWS, answererWS, ...clean } = roomdata[roomname];
    sendWS(ws, "response", { status: "offerdata_fetched", roomdata: clean });
  });
}

