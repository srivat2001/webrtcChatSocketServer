"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const offer_1 = require("./handlers/offer");
const answer_1 = require("./handlers/answer");
const reconnect_1 = require("./handlers/reconnect");
const getRoomData_1 = require("./handlers/getRoomData");
const persist_1 = require("./handlers/persist");
const server = http_1.default.createServer();
// Send a simple response for normal HTTP requests
server.on("request", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket Server Running (HTTP OK)");
});
// Create WS server
const wss = new ws_1.WebSocketServer({ noServer: true });
// Your WebSocket routing table
const routes = {
    "/create-connection": offer_1.createConnection,
    "/answer-connection": answer_1.answerConnection,
    "/connection-reconnect": reconnect_1.reconnectHandler,
    "/get-roomdata": getRoomData_1.getRoomData,
    "/persist-connection": persist_1.presistConnection,
};
// Upgrade handler for WS paths
server.on("upgrade", (req, socket, head) => {
    const handler = routes[req.url || ""];
    if (!handler)
        return socket.destroy(); // invalid path → close
    wss.handleUpgrade(req, socket, head, (ws) => handler(ws));
});
server.listen(3000, "0.0.0.0", () => {
    console.log("WS server running on 3000 (LAN enabled)");
});
//# sourceMappingURL=server.js.map