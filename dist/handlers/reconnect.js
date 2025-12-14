"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconnectHandler = reconnectHandler;
const store_1 = require("../rooms/store");
const response_1 = require("../utils/response");
function reconnectHandler(ws) {
    ws.on("message", (msg) => {
        const { roomname, role } = JSON.parse(msg);
        if (!roomname || !role)
            return (0, response_1.sendWS)(ws, "error", "Missing roomname or role");
        const room = store_1.roomdata[roomname];
        if (!room)
            return (0, response_1.sendWS)(ws, "error", "Room not found");
        if (role === "offer") {
            room.offererWS = ws;
            (0, response_1.sendWS)(ws, "response", { status: "reconnected_as_offer", roomname });
        }
        else {
            room.answererWS = ws;
            (0, response_1.sendWS)(ws, "response", { status: "reconnected_as_answer", roomname });
        }
        (0, response_1.sendWS)(room.conn, "alert", { status: "peer_reconnected", role });
    });
}
//# sourceMappingURL=reconnect.js.map