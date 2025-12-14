"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWS = sendWS;
function sendWS(ws, type, data) {
    ws.send(JSON.stringify({ type, data }));
}
//# sourceMappingURL=response.js.map