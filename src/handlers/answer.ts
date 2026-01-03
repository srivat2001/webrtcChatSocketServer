import { WebSocket } from "ws";
import { roomdata } from "../rooms/store";
import { sendWS } from "../utils/response";
export function answerConnection(ws: WebSocket, payload: any) {
  const { answerSDP, asnwerICEcandidates, roomname } = payload;

  if (!roomname || !answerSDP) {
    return sendWS(ws, "error", "Missing answer or roomname");
  }

  if (!roomdata[roomname]) {
    return sendWS(ws, "error", "Room not found");
  }

  roomdata[roomname].AnswererData = {
    answer: answerSDP,
    ICEcandidate: asnwerICEcandidates || [],
  };

  // Notify the offerer
  const conn = roomdata[roomname].conn;
  if (conn) {
    sendWS(conn, "alert", {
      status: "answer_ready",
      room: roomdata[roomname],
      forWho: "offer",
    });
  }

  sendWS(ws, "response", {
    status: "answer_added",
    roomname,
    forWho: "offer",
  });
}
