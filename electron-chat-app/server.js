const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'chatapp';
let db;

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

connectDB();

// REST API endpoints
app.get('/api/messages', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  try {
    const messages = await db.collection('messages')
      .find()
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    res.json(messages.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  try {
    const { username, text } = req.body;
    const message = { username, text, timestamp: new Date() };
    const result = await db.collection('messages').insertOne(message);
    message._id = result.insertedId;

    io.emit('new-message', message);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  try {
    const users = await db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  if (!db) return res.status(500).json({ error: "Database not connected" });
  try {
    const { username } = req.body;
    const user = { username, createdAt: new Date() };
    await db.collection('users').insertOne(user);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  socket.on('send-message', async (data) => {
    if (!db) return console.error("Database not connected");
    try {
      const message = { username: data.username, text: data.text, timestamp: new Date() };
      await db.collection('messages').insertOne(message);
      io.emit('new-message', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
