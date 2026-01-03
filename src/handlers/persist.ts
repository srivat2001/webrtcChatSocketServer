import { WebSocket } from "ws";
import { sendWS } from "../utils/response";
import { generateUniqueRoomId, roomdata } from "../rooms/store";

export function presistConnection(ws: WebSocket, payload: any) {
  let { roomname } = payload || {};

  if (!roomname || roomdata[roomname]) {
    roomname = generateUniqueRoomId();
  }

  roomdata[roomname] = {
    conn: ws, // keeping ws here (as you requested)
    roomname,
  };

  sendWS(ws, "response", {
    status: "room-created",
    roomname,
  });
}
