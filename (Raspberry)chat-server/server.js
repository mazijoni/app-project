// Simple WebSocket broadcast server
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server listening on ws://0.0.0.0:8080');
});

wss.on('connection', (ws, req) => {
  console.log('Client connected:', req.socket.remoteAddress);

  ws.on('message', (raw) => {
    // Broadcast incoming message to all connected clients
    // (assumes client sends JSON string) 
    try {
      // optionally validate/transform here
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(raw);
        }
      });
    } catch (e) {
      console.error('Message handling error', e);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('Socket error', err);
  });
});
