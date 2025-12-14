import http from "http";
import { WebSocketServer } from "ws";
import { createConnection } from "./handlers/offer";
import { answerConnection } from "./handlers/answer";
import { reconnectHandler } from "./handlers/reconnect";
import { getRoomData } from "./handlers/getRoomData";
import { presistConnection } from "./handlers/persist";

const server = http.createServer();

// Send a simple response for normal HTTP requests
server.on("request", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket Server Running (HTTP OK)");
});

// Create WS server
const wss = new WebSocketServer({ noServer: true });

// Your WebSocket routing table
const routes: Record<string, any> = {
  "/create-connection": createConnection,
  "/answer-connection": answerConnection,
  "/connection-reconnect": reconnectHandler,
  "/get-roomdata": getRoomData,
  "/persist-connection": presistConnection,
};

// Upgrade handler for WS paths
server.on("upgrade", (req, socket, head) => {
  const handler = routes[req.url || ""];
  if (!handler) return socket.destroy(); // invalid path → close

  wss.handleUpgrade(req, socket, head, (ws) => handler(ws));
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`WS server running on `+PORT+` (LAN enabled)`);
});
