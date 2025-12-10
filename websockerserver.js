import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer();
const wss = new WebSocketServer({ noServer: true });

// roomname → room entry
const roomdata = {};

server.on("upgrade", (req, socket, head) => {
  const { url } = req;

  if (url === "/create-connection") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      createConnection(ws);
    });
  } else if (url === "/answer-connection") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      answerConnection(ws);
    });
  } else if (url === "/connection-reconnect") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      reconnectHandler(ws);
    });
  } else if (url === "/get-roomdata") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      getRoomData(ws);
    });
  } else if (url === "/persist-connection") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      console.log("Persisting connection");
      presistConnection(ws);
    });
  } else {
    socket.destroy();
  }
});

// ---------------------------------------------------------
// OFFER SIDE
// ---------------------------------------------------------
function createConnection(ws) {
  ws.on("message", (msg) => {
    const { offer, ICEcandidate, roomname } = JSON.parse(msg);
    if (!roomname || !offer) {
      return ws.send(JSON.stringify({ Error: "Missing offer or roomname" }));
    }
    const newPacket = { conn: roomdata[roomname]?.conn };
    newPacket["OffererData"] = { offer, ICEcandidate: ICEcandidate || [] };
    roomdata[roomname] = newPacket;
    roomdata[roomname].conn.send(
      JSON.stringify({ status: "offer_added", roomdata: roomdata[roomname] })
    );
  });
}
function presistConnection(ws) {
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    const { roomname } = data;
    if (!roomname) {
      return ws.send(JSON.stringify({ Error: "Missing answer or roomname" }));
    }
    roomdata[roomname] = { conn: ws, roomname: roomname };
    ws.send(
      JSON.stringify({ status: "room-created", roomname: roomdata[roomname] })
    );
    console.log(`Room created: ${roomdata[roomname]}`);
  });
}
function answerConnection(ws) {
  ws.on("message", (msg) => {
    try {
      //    console.log("Received answer message:", msg.toString());
      const data = JSON.parse(msg.toString());
      const { answerSDP, asnwerICEcandidates, roomname } = data;
      console.log(roomdata[roomname]);
      if (!roomname || !answerSDP) {
        return ws.send(JSON.stringify({ Error: "Missing answer or roomname" }));
      }

      if (!roomdata[roomname]) {
        return ws.send(JSON.stringify({ Error: "Room not found" }));
      }
      // Store answer data properly
      roomdata[roomname].AnswererData = {
        answer: answerSDP,
        ICEcandidate: asnwerICEcandidates || [],
      };

      // Notify the offerer (or whoever created the room)
      roomdata[roomname].conn.send(
        JSON.stringify({
          status: "answer_added",
          roomdata: roomdata[roomname],
        })
      );

      console.log(`Answer added to room: ${roomname}`);
      const offererWS = roomdata[roomname].conn;
      if (offererWS && offererWS.readyState === WebSocket.OPEN) {
        offererWS.send(
          JSON.stringify({
            type: "answer_ready",
            room: roomdata[roomname],
          })
        );
      }

      ws.send(JSON.stringify({ status: "answer_added", roomname }));
    } catch (e) {
      console.error("Invalid JSON received:", e);
      ws.send(JSON.stringify({ Error: "Invalid JSON", e: e }));
    }
  });
}
function reconnectHandler(ws) {
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      const { roomname, role } = data;

      if (!roomname || !role) {
        return ws.send(JSON.stringify({ Error: "Missing roomname or role" }));
      }

      const room = roomdata[roomname];
      if (!room) {
        return ws.send(JSON.stringify({ Error: "Room not found" }));
      }

      // ---------------------------------------
      // Reattach socket based on role
      // ---------------------------------------
      if (role === "offer") {
        room.offererWS = ws;

        ws.send(
          JSON.stringify({
            status: "reconnected_as_offer",
            roomname,
            offer: room.OffererData?.offer,
            ICEcandidate: room.OffererData?.ICEcandidate || [],
            answer: room.AnswererData?.answer || null,
            answerICE: room.AnswererData?.ICEcandidate || [],
          })
        );

        console.log(`Offer side reconnected to room: ${roomname}`);
      } else if (role === "answer") {
        room.answererWS = ws;

        ws.send(
          JSON.stringify({
            status: "reconnected_as_answer",
            roomname,
            offer: room.OffererData?.offer,
            offerICE: room.OffererData?.ICEcandidate || [],
            answer: room.AnswererData?.answer || null,
            answerICE: room.AnswererData?.ICEcandidate || [],
          })
        );

        console.log(`Answer side reconnected to room: ${roomname}`);
      } else {
        return ws.send(JSON.stringify({ Error: "Invalid role" }));
      }
    } catch (e) {
      ws.send(JSON.stringify({ Error: "Invalid JSON" }));
    }
  });
}
function getRoomData(ws) {
  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);
      const { roomname } = data;

      if (!roomname) {
        return ws.send(JSON.stringify({ Error: "roomname is required" }));
      }

      // Room not found
      if (!roomdata[roomname]) {
        return ws.send(JSON.stringify({ Error: "Room not found" }));
      }

      const entry = roomdata[roomname];
      const { offererWS, answererWS, ...sendEntry } = entry;
      // Return just the offer-side data
      ws.send(
        JSON.stringify({
          status: "offerdata_fetched",
          roomname,
          roomdata: sendEntry,
        })
      );
    } catch (e) {
      console.error("Invalid JSON received:", msg);
      ws.send(JSON.stringify({ Error: "Invalid JSON" }));
    }
  });
}

server.listen(3000, () => console.log("WS server running on 3000"));
