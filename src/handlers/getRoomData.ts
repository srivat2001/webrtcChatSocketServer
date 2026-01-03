import { WebSocket } from "ws";
import { roomdata } from "../rooms/store";
import { sendWS } from "../utils/response";
export function getRoomData(ws: WebSocket, payload: any) {
  const { roomname } = payload;
  if (!roomname) return sendWS(ws, "error", { status: "roomname_is_required" });
  if (!roomdata[roomname])
    return sendWS(ws, "error", { status: "roomname_is_required" });
  const { offererWS, answererWS, ...clean } = roomdata[roomname];
  sendWS(ws, "response", {
    status: "offerdata_fetched",
    roomdata: clean,
    roomname: roomname,
    forWho: "answer",
  });
}
