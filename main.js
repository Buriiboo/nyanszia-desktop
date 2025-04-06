const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    },
  });

  win.loadFile('index.html');
  win.webContents.openDevTools({ mode: "detach" }); // Optional: comment this out when releasing
}

// 💻 Start app when ready
app.whenReady().then(createWindow);

// 💨 Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 🍎 Re-create window on macOS when app icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
