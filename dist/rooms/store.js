"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomdata = void 0;
exports.generateUniqueRoomId = generateUniqueRoomId;
exports.roomdata = {};
function generateUniqueRoomId() {
    const block = () => Math.random().toString(36).substring(2, 5);
    let id;
    do
        id = `device-${block()}-${block()}-${block()}`;
    while (exports.roomdata[id]);
    return id;
}
//# sourceMappingURL=store.js.map