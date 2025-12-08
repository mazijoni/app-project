# Electron Chat App

A real-time chat application built with Electron, Socket.IO, and PostgreSQL.

## Features

- 💬 Real-time messaging using Socket.IO
- 🖥️ Desktop application powered by Electron
- 🗄️ PostgreSQL database for message persistence
- 🌐 Express.js backend server
- 🔒 CORS-enabled API

## Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mazijoni/app-project.git
cd app-project/electron-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up your PostgreSQL database:
   - Create a new database for the chat app
   - Update the database configuration in `server.js` with your credentials

## Usage

1. Start the application:
```bash
npm start
```

This will launch both the Electron desktop app and the backend server.

## Project Structure

```
electron-chat-app/
├── index.html      # Main HTML file for the app interface
├── main.js         # Electron main process
├── preload.js      # Preload script for secure IPC
├── renderer.js     # Renderer process (frontend logic)
├── server.js       # Express + Socket.IO backend server
├── package.json    # Project dependencies and scripts
└── README.md       # This file
```

## Technologies Used

- **Electron** - Desktop application framework
- **Express.js** - Web server framework
- **Socket.IO** - Real-time bidirectional communication
- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js
- **CORS** - Cross-Origin Resource Sharing middleware

## Development

To modify the application:

1. **Frontend changes**: Edit `index.html`, `renderer.js`, or add CSS
2. **Backend changes**: Modify `server.js` for API endpoints and Socket.IO events
3. **Electron configuration**: Update `main.js` for window settings and app behavior

## License

This project is open source and available under the MIT License.

## Author

Created by Jonatan
- joni.no

## Contributing

Contributions, issues, and feature requests are welcome!
