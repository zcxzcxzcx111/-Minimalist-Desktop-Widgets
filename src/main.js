const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Map widget id -> BrowserWindow
const activeWindows = new Map();
let hubWindow = null;
let tray = null;
let globalLocked = false;

// Config path for persistent storage
const getConfigPath = () => {
  return path.join(app.getPath('userData'), 'macwidgets-multi-config.json');
};

const getGlobalLockPath = () => {
  return path.join(app.getPath('userData'), 'macwidgets-lock-status.json');
};

function loadGlobalLock() {
  if (fs.existsSync(getGlobalLockPath())) {
    try {
      const data = JSON.parse(fs.readFileSync(getGlobalLockPath(), 'utf8'));
      return !!data.locked;
    } catch (e) {}
  }
  return false;
}

function saveGlobalLock(locked) {
  try {
    fs.writeFileSync(getGlobalLockPath(), JSON.stringify({ locked }), 'utf8');
  } catch (e) {}
}

// Default initial widgets matching the 1:1 Apple layout from user photos
const defaultWidgets = [
  { id: 'w-clock-1', type: 'clock', size: '2x1', x: 80, y: 70, alwaysOnTop: false },
  { id: 'w-battery-1', type: 'battery', size: '2x1', x: 80, y: 265, alwaysOnTop: false },
  { id: 'w-todo-1', type: 'todo', size: '2x2', x: 80, y: 460, alwaysOnTop: false },
  { id: 'w-launcher-1', type: 'launcher', size: '2x2', x: 470, y: 265, alwaysOnTop: false },
  { id: 'w-weather-1', type: 'weather', size: '2x1', x: 470, y: 70, alwaysOnTop: false },
  { id: 'w-quote-1', type: 'quote', size: '2x1', x: 470, y: 655, alwaysOnTop: false },
];

function loadWidgetsConfig() {
  const configPath = getConfigPath();
  if (fs.existsSync(configPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (e) {
      console.error('Error loading config:', e);
    }
  }
  return defaultWidgets;
}

function saveWidgetsConfig(widgetsList) {
  try {
    fs.writeFileSync(getConfigPath(), JSON.stringify(widgetsList, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

function getDimensionsForSize(size) {
  switch (size) {
    case '1x1': return { width: 178, height: 178 };
    case '2x1': return { width: 372, height: 178 };
    case '2x2': return { width: 372, height: 372 };
    case '4x1': return { width: 760, height: 178 };
    case '4x2': return { width: 760, height: 372 };
    case '2x3': return { width: 372, height: 566 };
    default: return { width: 372, height: 372 };
  }
}

// Create an individual standalone BrowserWindow for a single widget on the desktop
function createWidgetWindow(widget) {
  if (activeWindows.has(widget.id)) {
    const win = activeWindows.get(widget.id);
    if (!win.isDestroyed()) {
      win.focus();
      return win;
    }
  }

  const { width, height } = getDimensionsForSize(widget.size);

  const win = new BrowserWindow({
    width,
    height,
    x: widget.x !== undefined ? widget.x : 100,
    y: widget.y !== undefined ? widget.y : 100,
    transparent: true,
    frame: false,
    hasShadow: false,
    resizable: false,
    movable: !globalLocked, // When global lock is enabled, prevent moving so widget is pinned firmly to desktop
    skipTaskbar: true,
    alwaysOnTop: widget.alwaysOnTop || false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const devUrl = `http://localhost:5173/?mode=widget&id=${widget.id}&type=${widget.type}&size=${widget.size}&locked=${globalLocked}`;
  const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}?mode=widget&id=${widget.id}&type=${widget.type}&size=${widget.size}&locked=${globalLocked}`;

  const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development' || fs.existsSync(path.join(__dirname, '../node_modules'));
  if (isDev) {
    win.loadURL(devUrl).catch(() => win.loadURL(prodUrl));
  } else {
    win.loadURL(prodUrl);
  }

  win.on('moved', () => {
    if (win.isDestroyed() || globalLocked) return;
    const [newX, newY] = win.getPosition();
    const widgets = loadWidgetsConfig();
    const updated = widgets.map(w => w.id === widget.id ? { ...w, x: newX, y: newY } : w);
    saveWidgetsConfig(updated);
  });

  win.on('closed', () => {
    activeWindows.delete(widget.id);
  });

  activeWindows.set(widget.id, win);
  return win;
}

// Create the MacWidgets Settings / Gallery Window (Must be a NORMAL opaque window, NOT transparent!)
function createHubWindow() {
  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.focus();
    return hubWindow;
  }

  hubWindow = new BrowserWindow({
    width: 920,
    height: 680,
    center: true,
    transparent: false,
    backgroundColor: '#1C1C1E',
    frame: true,
    autoHideMenuBar: true,
    title: 'MacWidgets 小组件设置与组件库 (1:1 Apple Contour Replica)',
    resizable: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const devUrl = `http://localhost:5173/?mode=hub`;
  const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}?mode=hub`;

  const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development' || fs.existsSync(path.join(__dirname, '../node_modules'));
  if (isDev) {
    hubWindow.loadURL(devUrl).catch(() => hubWindow.loadURL(prodUrl));
  } else {
    hubWindow.loadURL(prodUrl);
  }

  hubWindow.on('closed', () => {
    hubWindow = null;
  });

  return hubWindow;
}

function createTrayIcon() {
  try {
    const iconPath = path.join(__dirname, '../public/tray-icon.png');
    if (fs.existsSync(iconPath)) {
      tray = new Tray(iconPath);
      const contextMenu = Menu.buildFromTemplate([
        { label: '⚙️ 打开小组件设置与组件库 (Settings)', click: () => createHubWindow() },
        { type: 'separator' },
        { 
          label: globalLocked ? '🔓 解锁所有组件 (允许拖拽排布)' : '🔒 锁定所有组件 (固定在桌面层)', 
          click: () => toggleGlobalLockState() 
        },
        { label: '🔄 重新对齐所有桌面组件', click: () => initAllWidgets() },
        { type: 'separator' },
        { label: '❌ 退出 MacWidgets', click: () => app.quit() }
      ]);
      tray.setToolTip('MacWidgets for Windows · 1:1 Apple Contour');
      tray.setContextMenu(contextMenu);
      tray.on('double-click', () => createHubWindow());
    }
  } catch (e) {
    console.log('Tray creation note:', e.message);
  }
}

function toggleGlobalLockState(forceState) {
  globalLocked = forceState !== undefined ? forceState : !globalLocked;
  saveGlobalLock(globalLocked);

  activeWindows.forEach(win => {
    if (!win.isDestroyed()) {
      win.setMovable(!globalLocked);
      win.webContents.send('lock-changed', globalLocked);
    }
  });

  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.webContents.send('lock-changed', globalLocked);
  }
  
  createTrayIcon();
}

function initAllWidgets() {
  globalLocked = loadGlobalLock();
  const widgets = loadWidgetsConfig();
  widgets.forEach(w => {
    createWidgetWindow(w);
  });
}

app.whenReady().then(() => {
  initAllWidgets();
  createHubWindow();
  createTrayIcon();

  app.on('activate', () => {
    if (activeWindows.size === 0 && !hubWindow) {
      initAllWidgets();
      createHubWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !tray) {
    // Keep running
  }
});

// IPC Handlers
ipcMain.handle('get-widgets-config', () => {
  return loadWidgetsConfig();
});

ipcMain.handle('get-lock-status', () => {
  return globalLocked;
});

ipcMain.on('open-hub', () => {
  createHubWindow();
});

ipcMain.on('close-hub', () => {
  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.close();
  }
});

ipcMain.on('toggle-global-lock', (event, targetState) => {
  toggleGlobalLockState(targetState);
});

ipcMain.on('add-widget', (event, { type, size }) => {
  const widgets = loadWidgetsConfig();
  const newId = `w-${type}-${Date.now()}`;
  
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const newX = Math.floor((width / 2) - 186 + (Math.random() * 140 - 70));
  const newY = Math.floor((height / 2) - 186 + (Math.random() * 140 - 70));

  const newWidget = { id: newId, type, size, x: newX, y: newY, alwaysOnTop: false };
  const updated = [newWidget, ...widgets];
  saveWidgetsConfig(updated);

  createWidgetWindow(newWidget);

  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.webContents.send('config-updated', updated);
  }
});

ipcMain.on('remove-widget', (event, id) => {
  const widgets = loadWidgetsConfig();
  const updated = widgets.filter(w => w.id !== id);
  saveWidgetsConfig(updated);

  if (activeWindows.has(id)) {
    const win = activeWindows.get(id);
    if (!win.isDestroyed()) win.close();
    activeWindows.delete(id);
  }

  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.webContents.send('config-updated', updated);
  }
});

ipcMain.on('update-widget-size', (event, { id, nextSize }) => {
  const widgets = loadWidgetsConfig();
  const widget = widgets.find(w => w.id === id);
  if (!widget) return;

  widget.size = nextSize;
  saveWidgetsConfig(widgets);

  if (activeWindows.has(id)) {
    const win = activeWindows.get(id);
    if (!win.isDestroyed()) {
      const { width, height } = getDimensionsForSize(nextSize);
      win.setSize(width, height);
      win.webContents.send('size-changed', nextSize);
    }
  }

  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.webContents.send('config-updated', widgets);
  }
});

ipcMain.on('toggle-widget-top', (event, { id }) => {
  const widgets = loadWidgetsConfig();
  const widget = widgets.find(w => w.id === id);
  if (!widget) return;

  widget.alwaysOnTop = !widget.alwaysOnTop;
  saveWidgetsConfig(widgets);

  if (activeWindows.has(id)) {
    const win = activeWindows.get(id);
    if (!win.isDestroyed()) {
      win.setAlwaysOnTop(widget.alwaysOnTop, 'floating');
      win.webContents.send('top-changed', widget.alwaysOnTop);
    }
  }

  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.webContents.send('config-updated', widgets);
  }
});

ipcMain.on('focus-widget', (event, id) => {
  if (activeWindows.has(id)) {
    const win = activeWindows.get(id);
    if (!win.isDestroyed()) {
      win.focus();
    }
  }
});

ipcMain.on('broadcast-theme', (event, themeId) => {
  activeWindows.forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send('theme-changed', themeId);
    }
  });
});
