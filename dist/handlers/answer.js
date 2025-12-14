"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.answerConnection = answerConnection;
const store_1 = require("../rooms/store");
const response_1 = require("../utils/response");
function answerConnection(ws) {
    ws.on("message", (msg) => {
        const { answerSDP, asnwerICEcandidates, roomname } = JSON.parse(msg);
        if (!roomname || !answerSDP) {
            return (0, response_1.sendWS)(ws, "error", "Missing answer or roomname");
        }
        if (!store_1.roomdata[roomname]) {
            return (0, response_1.sendWS)(ws, "error", "Room not found");
        }
        store_1.roomdata[roomname].AnswererData = {
            answer: answerSDP,
            ICEcandidate: asnwerICEcandidates || []
        };
        // Notify the offerer
        const conn = store_1.roomdata[roomname].conn;
        if (conn)
            (0, response_1.sendWS)(conn, "alert", { status: "answer_ready", room: store_1.roomdata[roomname] });
        (0, response_1.sendWS)(ws, "response", { status: "answer_added", roomname });
    });
}
//# sourceMappingURL=answer.js.map