import { WebSocket } from "ws";
import { roomdata, RoomData } from "../rooms/store";
import { sendWS } from "../utils/response";

export function createConnection(ws: WebSocket) {
  ws.on("message", (msg: string) => {
    const { offer, ICEcandidate, roomname } = JSON.parse(msg);

    if (!roomname || !offer) {
      return sendWS(ws, "error", "Missing offer or roomname");
    }

    roomdata[roomname] = {
      ...roomdata[roomname],
      OffererData: { offer, ICEcandidate: ICEcandidate || [] }
    };

    const conn = roomdata[roomname].conn;
    if (conn) sendWS(conn, "alert", { status: "offer_added", roomname });

    sendWS(ws, "response", { status: "offer_stored", roomname });
  });
}
