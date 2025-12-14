import { WebSocket } from "ws";
import { sendWS } from "../utils/response";
import { generateUniqueRoomId, roomdata } from "../rooms/store";

export function presistConnection(ws: WebSocket) {
  ws.on("message", (msg: string) => {
    let { roomname } = JSON.parse(msg);
    if (!roomname || roomdata[roomname]) roomname = generateUniqueRoomId();

    roomdata[roomname] = { conn: ws, roomname };

    sendWS(ws, "response", {
      status: "room-created",
      roomname
    });
  });
}
