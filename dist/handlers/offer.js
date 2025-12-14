"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = createConnection;
const store_1 = require("../rooms/store");
const response_1 = require("../utils/response");
function createConnection(ws) {
    ws.on("message", (msg) => {
        const { offer, ICEcandidate, roomname } = JSON.parse(msg);
        if (!roomname || !offer) {
            return (0, response_1.sendWS)(ws, "error", "Missing offer or roomname");
        }
        store_1.roomdata[roomname] = {
            ...store_1.roomdata[roomname],
            OffererData: { offer, ICEcandidate: ICEcandidate || [] }
        };
        const conn = store_1.roomdata[roomname].conn;
        if (conn)
            (0, response_1.sendWS)(conn, "alert", { status: "offer_added", roomname });
        (0, response_1.sendWS)(ws, "response", { status: "offer_stored", roomname });
    });
}
//# sourceMappingURL=offer.js.map