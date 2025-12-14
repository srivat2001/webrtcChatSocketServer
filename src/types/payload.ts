export type MessagePayload = {
  roomname?: string;
  offer?: any;
  ICEcandidate?: any[];
  answerSDP?: any;
  asnwerICEcandidates?: any[];
  role?: "offer" | "answer";
};
