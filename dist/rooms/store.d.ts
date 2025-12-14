import { WebSocket } from "ws";
export type RoomData = {
    conn?: WebSocket;
    roomname?: string;
    OffererData?: {
        offer: any;
        ICEcandidate: any[];
    };
    AnswererData?: {
        answer: any;
        ICEcandidate: any[];
    };
    offererWS?: WebSocket;
    answererWS?: WebSocket;
};
export declare const roomdata: Record<string, RoomData>;
export declare function generateUniqueRoomId(): string;
