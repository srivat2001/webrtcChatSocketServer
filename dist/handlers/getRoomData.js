"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomData = getRoomData;
const store_1 = require("../rooms/store");
const response_1 = require("../utils/response");
function getRoomData(ws) {
    ws.on("message", (msg) => {
        const { roomname } = JSON.parse(msg);
        if (!roomname)
            return (0, response_1.sendWS)(ws, "error", "roomname is required");
        if (!store_1.roomdata[roomname])
            return (0, response_1.sendWS)(ws, "error", "Room not found");
        const { offererWS, answererWS, ...clean } = store_1.roomdata[roomname];
        (0, response_1.sendWS)(ws, "response", { status: "offerdata_fetched", roomdata: clean });
    });
}
//# sourceMappingURL=getRoomData.js.map