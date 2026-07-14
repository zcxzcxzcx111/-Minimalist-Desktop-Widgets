const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;
let tray = null;

function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: Math.min(1420, width - 40),
    height: Math.min(920, height - 40),
    x: 20,
    y: 20,
    transparent: true,
    frame: false,
    hasShadow: false,
    resizable: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  // Check if we are running in dev mode
  const devUrl = 'http://localhost:5173';
  
  // Try loading dev server, or fallback to dist
  if (process.argv.includes('--dev') || process.env.NODE_ENV === 'development' || fs.existsSync(path.join(__dirname, '../node_modules'))) {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Open devtools in dev if needed (commented out by default so it stays clean)
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  // Create a simple system tray menu
  // If icon missing, we create a fallback blank icon or skip
  const iconPath = path.join(__dirname, '../public/tray-icon.png');
  // We can initialize tray if needed, or handle right-click menu easily
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for window controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('window-toggle-top', (event, flag) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(flag, 'floating');
    event.reply('top-status-changed', flag);
  }
});

// Set window click-through (for lock-to-desktop mode if needed)
ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  if (mainWindow) {
    mainWindow.setIgnoreMouseEvents(ignore, options);
  }
});
