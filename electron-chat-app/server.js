const express = require('express');
const { Pool } = require('pg');
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

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'chatapp',
  password: 'nordpolen16',
  port: 5432,
});

async function initDB() {
  try {
    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMP NOT NULL
      )
    `);
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        createdat TIMESTAMP NOT NULL
      )
    `);
    
    console.log('Connected to PostgreSQL and tables initialized');
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
  }
}

initDB();

// REST API endpoints
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM messages ORDER BY timestamp DESC LIMIT 50'
    );
    res.json(result.rows.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { username, text } = req.body;
    const timestamp = new Date();
    const result = await pool.query(
      'INSERT INTO messages (username, text, timestamp) VALUES ($1, $2, $3) RETURNING *',
      [username, text, timestamp]
    );
    const message = result.rows[0];
    io.emit('new-message', message);
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    const createdat = new Date();
    const result = await pool.query(
      'INSERT INTO users (username, createdat) VALUES ($1, $2) ON CONFLICT (username) DO NOTHING RETURNING *',
      [username, createdat]
    );
    let user = result.rows[0];
    if (!user) {
      const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      user = existing.rows[0];
    }
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
    try {
      const timestamp = new Date();
      const result = await pool.query(
        'INSERT INTO messages (username, text, timestamp) VALUES ($1, $2, $3) RETURNING *',
        [data.username, data.text, timestamp]
      );
      const message = result.rows[0];
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
