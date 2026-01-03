import { WebSocket } from "ws";
import { roomdata } from "../rooms/store";
import { MessagePayload } from "../types/payload";
import { sendWS } from "../utils/response";

export function reconnectHandler(ws: WebSocket, payload: any) {
  const { roomname, role } = payload;
  if (!roomname || !role)
    return sendWS(ws, "error", "Missing roomname or role");

  const room = roomdata[roomname];
  if (!room) return sendWS(ws, "error", "Room not found");

  if (role === "offer") {
    room.offererWS = ws;
    sendWS(ws, "response", { status: "reconnected_as_offer", roomname });
  } else {
    room.answererWS = ws;
    sendWS(ws, "response", { status: "reconnected_as_answer", roomname });
  }

  sendWS(room.conn!, "alert", { status: "peer_reconnected", role });
}
