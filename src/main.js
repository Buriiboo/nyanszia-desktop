// --- at top of src/main.js ---
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js'); 
  const indexPath   = path.join(__dirname, '..', 'index.html');

  console.log('[Nyanszia] main entry:', __filename);
  console.log('[Nyanszia] resolved preload path:', preloadPath);
  console.log('[Nyanszia] resolved index path:', indexPath);

  win = new BrowserWindow({
    width: 520,
    height: 720,
    show: true,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(indexPath);

  win.webContents.openDevTools({ mode: 'detach' });

  win.webContents.on('did-finish-load', () => {
    console.log('[Nyanszia] did-finish-load fired');
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());

// Optional IPC sample
ipcMain.on('ny:minimize', () => win && win.minimize());
