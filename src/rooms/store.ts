import { WebSocket } from "ws";

export type RoomData = {
  conn?: WebSocket;
  roomname?: string;
  OffererData?: { offer: any; ICEcandidate: any[] };
  AnswererData?: { answer: any; ICEcandidate: any[] };
  offererWS?: WebSocket;
  answererWS?: WebSocket;
};

export const roomdata: Record<string, RoomData> = {};

export function generateUniqueRoomId(): string {
  const block = () => Math.random().toString(36).substring(2, 5);
  let id: string;
  do id = `device-${block()}-${block()}-${block()}`;
  while (roomdata[id]);
  return id;
}
