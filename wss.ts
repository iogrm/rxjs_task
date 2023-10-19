import WebSocket from "ws";

const wsPort = 3001;

export const wss = new WebSocket.Server({ port: wsPort });

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.send(`Welcome client!`);

  ws.on("message", (message: string) => {
    console.log(`Received message: ${message}`);
    ws.send(`Server received your message: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
