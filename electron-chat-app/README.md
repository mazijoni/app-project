## Running the App

1. **Start MongoDB**: Make sure MongoDB is running
2. **Start the backend**: `node server.js` (in one terminal)
3. **Start Electron**: `npm start` (in another terminal)

Or install `concurrently` (`npm install --save-dev concurrently`) and run: `npm run dev`

## Project Structure
```
electron-chat-app/
├── main.js              # Electron main process
├── preload.js           # Preload script
├── index.html           # Frontend UI
├── renderer.js          # Frontend logic
├── server.js            # Backend API + Socket.IO
└── package.json         # Dependencies