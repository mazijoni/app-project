const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),

  // WebSocket chat connection factory
  // Usage: const ws = window.electronAPI.connectToServer(url);
  // ws.onOpen(cb), ws.onMessage(cb), ws.onClose(cb), ws.onError(cb), ws.send(obj)
  connectToServer: (url) => {
    let socket;

    function create() {
      socket = new WebSocket(url);

      // optional auto-reconnect placeholder (not automatic here)
      socket.addEventListener('open', () => {
        // nothing here; user will add onOpen handler
      });
    }

    create();

    const listeners = {
      open: [],
      message: [],
      close: [],
      error: []
    };

    socket.addEventListener('open', (ev) => {
      listeners.open.forEach(cb => { try { cb(ev); } catch(e){ console.error(e); } });
    });

    socket.addEventListener('message', (ev) => {
      listeners.message.forEach(cb => {
        try { cb(ev.data); } catch(e) { console.error(e); }
      });
    });

    socket.addEventListener('close', (ev) => {
      listeners.close.forEach(cb => { try { cb(ev); } catch(e){ console.error(e); } });
    });

    socket.addEventListener('error', (ev) => {
      listeners.error.forEach(cb => { try { cb(ev); } catch(e){ console.error(e); } });
    });

    return {
      onOpen: (cb) => { listeners.open.push(cb); },
      onMessage: (cb) => { listeners.message.push(cb); },
      onClose: (cb) => { listeners.close.push(cb); },
      onError: (cb) => { listeners.error.push(cb); },
      send: (objOrString) => {
        try {
          const payload = typeof objOrString === 'string' ? objOrString : JSON.stringify(objOrString);
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(payload);
            return true;
          } else {
            console.warn('WebSocket not open, cannot send');
            return false;
          }
        } catch (e) {
          console.error('Send error', e);
          return false;
        }
      },
      rawSocket: () => socket // in case you need direct access (read-only)
    };
  }
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded!');
});
