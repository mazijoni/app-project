# 📦 Chat App (Electron + WebSocket Server)

A lightweight, real-time chat application built with **Electron** for the client and a **Node.js WebSocket server** running on a **Raspberry Pi / Linux** machine.  
The app features a custom window frame, contact list, chat UI, and real-time messaging via WebSockets.

---

## ✨ Features

### **Client (Electron App)**
- Custom titlebar (minimize / maximize / close)
- Modern messaging UI
- Contact system (add / remove)
- Per-contact chat history (in-memory)
- Real-time WebSocket messaging
- Runs on Windows, macOS, and Linux

### **Server (Node.js WebSocket Server)**
- Handles connections from all clients
- Broadcasts messages to everyone
- Very lightweight (`ws` package)
- Perfect for Raspberry Pi hosting

---

## 🗂 Project Structure

