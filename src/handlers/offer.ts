import { WebSocket } from "ws";
import { generateUniqueRoomId, roomdata, RoomData } from "../rooms/store";
import { sendWS } from "../utils/response";

export function createConnection(ws: WebSocket, payload: any) {
  let { offer, ICEcandidate, roomname } = payload;
  if (!roomname || roomdata[roomname]) {
    roomname = generateUniqueRoomId();
  }

  roomdata[roomname] = {
    ...roomdata[roomname],
    OffererData: { offer, ICEcandidate: ICEcandidate || [] },
    conn: ws,
  };
  // const conn = roomdata[roomname].conn;
  // if (conn) sendWS(conn, "alert", { status: "offer_added", roomname });

  sendWS(ws, "response", { status: "offer_stored", roomname, forWho: "offer" });
}
