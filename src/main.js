const { app, BrowserWindow, ipcMain, screen, Tray, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Store active widget windows: map id -> BrowserWindow
const activeWindows = new Map();
let hubWindow = null;
let tray = null;

// Config path for persistent storage
const getConfigPath = () => {
  return path.join(app.getPath('userData'), 'macwidgets-multi-config.json');
};

// Default initial widgets if none exist yet
const defaultWidgets = [
  { id: 'w-clock-1', type: 'clock', size: '2x1', x: 80, y: 80, alwaysOnTop: false },
  { id: 'w-weather-1', type: 'weather', size: '2x1', x: 460, y: 80, alwaysOnTop: false },
  { id: 'w-battery-1', type: 'battery', size: '2x2', x: 80, y: 270, alwaysOnTop: false },
  { id: 'w-todo-1', type: 'todo', size: '2x2', x: 460, y: 270, alwaysOnTop: false },
  { id: 'w-quote-1', type: 'quote', size: '2x1', x: 80, y: 650, alwaysOnTop: false },
  { id: 'w-launcher-1', type: 'launcher', size: '2x2', x: 840, y: 270, alwaysOnTop: false },
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
    case '1x1': return { width: 174, height: 174 };
    case '2x1': return { width: 364, height: 174 };
    case '2x2': return { width: 364, height: 364 };
    case '4x1': return { width: 734, height: 174 };
    case '4x2': return { width: 734, height: 364 };
    case '2x3': return { width: 364, height: 554 };
    default: return { width: 364, height: 364 };
  }
}

// Create an individual standalone BrowserWindow for a single widget
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
    skipTaskbar: true, // Don't crowd the Windows taskbar
    alwaysOnTop: widget.alwaysOnTop || false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const devUrl = `http://localhost:5173/?mode=widget&id=${widget.id}&type=${widget.type}&size=${widget.size}`;
  const prodUrl = `file://${path.join(__dirname, '../dist/index.html')}?mode=widget&id=${widget.id}&type=${widget.type}&size=${widget.size}`;

  const isDev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development' || fs.existsSync(path.join(__dirname, '../node_modules'));
  if (isDev) {
    win.loadURL(devUrl).catch(() => win.loadURL(prodUrl));
  } else {
    win.loadURL(prodUrl);
  }

  // Track window move events and auto-save exact desktop coordinates
  win.on('moved', () => {
    if (win.isDestroyed()) return;
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

// Create the MacWidgets Control Hub / Gallery Window
function createHubWindow() {
  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.focus();
    return hubWindow;
  }

  hubWindow = new BrowserWindow({
    width: 860,
    height: 640,
    center: true,
    transparent: true,
    frame: false,
    hasShadow: true,
    resizable: false,
    skipTaskbar: false, // Show Hub in taskbar
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
  // Try using icon if exists, otherwise right-click tray menu works
  try {
    const iconPath = path.join(__dirname, '../public/tray-icon.png');
    if (fs.existsSync(iconPath)) {
      tray = new Tray(iconPath);
      const contextMenu = Menu.buildFromTemplate([
        { label: '🖥️ 打开控制中心 (添加与管理组件)', click: () => createHubWindow() },
        { type: 'separator' },
        { label: '🔄 重新对齐所有小组件', click: () => initAllWidgets() },
        { label: '❌ 退出 MacWidgets', click: () => app.quit() }
      ]);
      tray.setToolTip('MacWidgets for Windows · 独立小组件');
      tray.setContextMenu(contextMenu);
      tray.on('double-click', () => createHubWindow());
    }
  } catch (e) {
    console.log('Tray creation note:', e.message);
  }
}

function initAllWidgets() {
  const widgets = loadWidgetsConfig();
  widgets.forEach(w => {
    createWidgetWindow(w);
  });
}

app.whenReady().then(() => {
  initAllWidgets();
  createHubWindow(); // Also open the Control Hub on initial launch so the user sees the new clean layout
  createTrayIcon();

  app.on('activate', () => {
    if (activeWindows.size === 0 && !hubWindow) {
      initAllWidgets();
      createHubWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Keep app running in background even if all windows closed, or quit when user requests
  if (process.platform !== 'darwin' && !tray) {
    // We can stay active or check activeWindows
  }
});

// IPC Communication Handlers
ipcMain.handle('get-widgets-config', () => {
  return loadWidgetsConfig();
});

ipcMain.on('open-hub', () => {
  createHubWindow();
});

ipcMain.on('close-hub', () => {
  if (hubWindow && !hubWindow.isDestroyed()) {
    hubWindow.close();
  }
});

ipcMain.on('add-widget', (event, { type, size }) => {
  const widgets = loadWidgetsConfig();
  const newId = `w-${type}-${Date.now()}`;
  
  // Calculate a smart staggered initial position near center of screen
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const newX = Math.floor((width / 2) - 180 + (Math.random() * 120 - 60));
  const newY = Math.floor((height / 2) - 180 + (Math.random() * 120 - 60));

  const newWidget = { id: newId, type, size, x: newX, y: newY, alwaysOnTop: false };
  const updated = [newWidget, ...widgets];
  saveWidgetsConfig(updated);

  createWidgetWindow(newWidget);

  // Notify hub if open
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
      // Also notify renderer inside this window
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

ipcMain.on('broadcast-theme', (event, themeId) => {
  activeWindows.forEach(win => {
    if (!win.isDestroyed()) {
      win.webContents.send('theme-changed', themeId);
    }
  });
});
