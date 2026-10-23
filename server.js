const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New user connected.');

  // Listen for incoming messages from either Trainee or TPO
  ws.on('message', (data) => {
    try {
      const parsedMessage = JSON.parse(data);
      console.log(` [${parsedMessage.sender}]: ${parsedMessage.text}`);

      // Broadcast the message to all connected clients (Trainees & TPOs)
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(parsedMessage));
        }
      });
    } catch (e) {
      console.error('Invalid JSON received');
    }
  });

  ws.on('close', () => {
    console.log(' User disconnected.');
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(` WebSocket server running on ws://localhost:${PORT}`);
});