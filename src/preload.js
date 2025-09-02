// CommonJS preload (Electron default when not using "type":"module")
const { contextBridge, ipcRenderer } = require('electron');

// Don't reference __filename (it may not exist in some setups)
console.log('[Nyanszia] preload loaded');

contextBridge.exposeInMainWorld('nyanszia', {
  ping: () => 'meow~',
  minimize: () => ipcRenderer.send('ny:minimize'),
  allowClicks: (allow) => ipcRenderer.send('ny:ignore-mouse', !allow),
});
