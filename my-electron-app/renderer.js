const { ipcRenderer } = require('electron');

document.getElementById('min-btn').addEventListener('click', () => {
  ipcRenderer.send('window-control', 'minimize');
});
document.getElementById('max-btn').addEventListener('click', () => {
  ipcRenderer.send('window-control', 'maximize');
});
document.getElementById('close-btn').addEventListener('click', () => {
  ipcRenderer.send('window-control', 'close');
});
