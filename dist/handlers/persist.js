"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.presistConnection = presistConnection;
const response_1 = require("../utils/response");
const store_1 = require("../rooms/store");
function presistConnection(ws) {
    ws.on("message", (msg) => {
        let { roomname } = JSON.parse(msg);
        if (!roomname || store_1.roomdata[roomname])
            roomname = (0, store_1.generateUniqueRoomId)();
        store_1.roomdata[roomname] = { conn: ws, roomname };
        (0, response_1.sendWS)(ws, "response", {
            status: "room-created",
            roomname
        });
    });
}
//# sourceMappingURL=persist.js.map