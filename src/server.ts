import http from "http";
import { WebSocketServer, WebSocket } from "ws";

import { createConnection } from "./handlers/offer";
import { answerConnection } from "./handlers/answer";
import { reconnectHandler } from "./handlers/reconnect";
import { getRoomData } from "./handlers/getRoomData";
import { presistConnection } from "./handlers/persist";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server Running (HTTP OK)");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws: WebSocket) => {
  console.log("WS connected");

  ws.on("message", (raw: string) => {
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    const { type, payload } = data;

    switch (type) {
      case "persist-connection":
        presistConnection(ws, payload);
        break;

      case "create-connection":
        createConnection(ws, payload);
        break;

      case "answer-connection":
        answerConnection(ws, payload);
        break;

      case "get-roomdata":
        getRoomData(ws, payload);
        break;

      case "connection-reconnect":
        reconnectHandler(ws, payload);
        break;

      case "ping":
        ws.send(JSON.stringify({ type: "pong" }));
        break;

      default:
        console.warn("Unknown WS message type:", type);
    }
  });

  ws.on("close", () => {
    console.log("WS closed");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WS server running on ${PORT}`);
});
