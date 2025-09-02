// src/main.js — Nyanszia Desktop (Electron)

// Core
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let win;
const isDev = !app.isPackaged;

function resolvePaths() {
  const ROOT = path.join(__dirname, '..');                 // project root
  const PRELOAD = path.join(__dirname, 'preload.js');      // src/preload.js
  const DEMO_INDEX = path.join(ROOT, 'third_party', 'cubism_demo', 'index.html'); // SDK sample dist
  const APP_INDEX = path.join(ROOT, 'index.html');         // your own app index.html
  return { ROOT, PRELOAD, DEMO_INDEX, APP_INDEX };
}

function createWindow() {
  const { ROOT, PRELOAD, DEMO_INDEX, APP_INDEX } = resolvePaths();

  console.log('[Nyanszia] main entry        :', __filename);
  console.log('[Nyanszia] preload path      :', PRELOAD);
  console.log('[Nyanszia] demo index (try)  :', DEMO_INDEX);
  console.log('[Nyanszia] app  index (alt)  :', APP_INDEX);

  // Basic window (frameless, transparent, always-on-top)
  win = new BrowserWindow({
    width: 520,
    height: 720,
    minWidth: 360,
    minHeight: 480,
    show: true,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: PRELOAD,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // allow preload to read local files if needed
    },
  });

  // Deny new windows (security)
  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  // Decide what to load (prefer the SDK sample build if present)
  const targetIndex = fs.existsSync(DEMO_INDEX) ? DEMO_INDEX : APP_INDEX;
  console.log('[Nyanszia] will load          :', targetIndex);

  if (!fs.existsSync(targetIndex)) {
    console.error('[Nyanszia] FATAL: index.html not found at', targetIndex);
  }
  win.loadFile(targetIndex);

  // Dev helpers
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  win.webContents.on('did-finish-load', () => {
    console.log('[Nyanszia] did-finish-load fired');
  });

  // Optional: simple reload / devtools hotkeys
  win.webContents.on('before-input-event', (event, input) => {
    const ctrlOrCmd = process.platform === 'darwin' ? input.meta : input.control;
    if (ctrlOrCmd && input.key.toLowerCase() === 'r') { win.reload(); event.preventDefault(); }
    if (ctrlOrCmd && input.shift && input.key.toLowerCase() === 'i') { win.webContents.toggleDevTools(); event.preventDefault(); }
  });
}

app.whenReady().then(() => {
  // Single-instance lock (optional but nice)
  const gotLock = app.requestSingleInstanceLock();
  if (!gotLock) {
    app.quit();
    return;
  }
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit on all windows closed (except macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ---------- IPC wiring ----------
ipcMain.on('ny:minimize', () => win && win.minimize());

/**
 * Toggle click-through.
 * From preload: ipcRenderer.send('ny:ignore-mouse', true|false)
 * true  -> ignore clicks (window becomes click-through)
 * false -> accept clicks
 */
ipcMain.on('ny:ignore-mouse', (_e, ignore) => {
  if (!win) return;
  try {
    // When ignoring, forward pointer events to let hover effects still work
    win.setIgnoreMouseEvents(!!ignore, { forward: true });
    console.log('[Nyanszia] setIgnoreMouseEvents:', !!ignore);
  } catch (err) {
    console.error('[Nyanszia] setIgnoreMouseEvents failed:', err);
  }
});
