const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific Node.js features
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform
});