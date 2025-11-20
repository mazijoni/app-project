const API_URL = 'http://localhost:3000';
const socket = io(API_URL);

let currentUsername = '';

// DOM Elements
const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const loginBtn = document.getElementById('login-btn');
const messagesDiv = document.getElementById('messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const currentUserDiv = document.getElementById('current-user');

// Login
loginBtn.addEventListener('click', async () => {
  const username = usernameInput.value.trim();
  if (username) {
    currentUsername = username;
    
    // Save user to database
    await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    
    loginScreen.classList.add('hidden');
    chatScreen.style.display = 'flex';
    currentUserDiv.textContent = `Logged in as: ${username}`;
    
    // Load previous messages
    loadMessages();
  }
});

// Load messages from database
async function loadMessages() {
  try {
    const response = await fetch(`${API_URL}/api/messages`);
    const messages = await response.json();
    messages.forEach(msg => displayMessage(msg));
  } catch (err) {
    console.error('Error loading messages:', err);
  }
}

// Send message
messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  
  if (text) {
    socket.emit('send-message', {
      username: currentUsername,
      text
    });
    
    messageInput.value = '';
  }
});

// Listen for new messages
socket.on('new-message', (message) => {
  displayMessage(message);
});

// Display message
function displayMessage(message) {
  const messageEl = document.createElement('div');
  messageEl.className = 'message';
  
  const time = new Date(message.timestamp).toLocaleTimeString();
  
  messageEl.innerHTML = `
    <div class="message-username">${message.username}</div>
    <div class="message-text">${escapeHtml(message.text)}</div>
    <div class="message-time">${time}</div>
  `;
  
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Handle Enter key in username input
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});