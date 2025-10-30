const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Disable hardware acceleration before anything else
app.disableHardwareAcceleration();

// Check if running in development
const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    },
    // Only set icon if file exists to avoid packaging/runtime errors
    icon: fs.existsSync(path.join(__dirname, '../assets/icon.png')) ? path.join(__dirname, '../assets/icon.png') : undefined
  });

  const port = process.env.VITE_PORT || 3002;
  const startUrl = isDev
    ? `http://localhost:${port}`
    : `file://${path.join(__dirname, '../dist/index.html')}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers for file operations
ipcMain.handle('save-project', async (event, projectData) => {
  // Basic validation
  if (!projectData || typeof projectData.name !== 'string') {
    return { success: false, error: 'Invalid project data. "name" is required.' };
  }

  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `${projectData.name}.yuga`,
    filters: [
      { name: 'YUGA Projects', extensions: ['yuga'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(projectData, null, 2));
      return { success: true, path: filePath };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }
  return { success: false };
});

ipcMain.handle('load-project', async (event) => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'YUGA Projects', extensions: ['yuga'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: ['openFile']
  });

  if (filePaths && filePaths.length > 0) {
    try {
      const raw = fs.readFileSync(filePaths[0], 'utf-8');
      const parsed = JSON.parse(raw);
      return { success: true, data: parsed, path: filePaths[0] };
    } catch (err) {
      return { success: false, error: 'Failed to read or parse project file: ' + String(err) };
    }
  }
  return { success: false };
});

ipcMain.handle('export-game', async (event, format) => {
  const allowed = { webgl: 'html', exe: 'exe' };
  const ext = allowed[format] || 'html';
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: `game.${ext}`,
    filters: [
      { name: 'WebGL Build', extensions: ['html'] },
      { name: 'Executable', extensions: ['exe'] }
    ]
  });

  if (filePath) {
    // In a real implementation, we'd produce the build here. For now, return path.
    return { success: true, path: filePath };
  }
  return { success: false };
});

// Expose app version to renderer
ipcMain.handle('get-app-version', async () => {
  try {
    return { success: true, version: app.getVersion() };
  } catch (e) {
    return { success: false, error: String(e) };
  }
});

// Create application menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        accelerator: 'CmdOrCtrl+N',
        click: () => mainWindow.webContents.send('menu-new-project')
      },
      {
        label: 'Open Project',
        accelerator: 'CmdOrCtrl+O',
        click: () => mainWindow.webContents.send('menu-open-project')
      },
      {
        label: 'Save Project',
        accelerator: 'CmdOrCtrl+S',
        click: () => mainWindow.webContents.send('menu-save-project')
      },
      { type: 'separator' },
      {
        label: 'Export Game',
        submenu: [
          {
            label: 'WebGL',
            click: () => mainWindow.webContents.send('menu-export-webgl')
          },
          {
            label: 'Windows Executable',
            click: () => mainWindow.webContents.send('menu-export-windows')
          },
          {
            label: 'macOS App',
            click: () => mainWindow.webContents.send('menu-export-macos')
          },
          {
            label: 'Linux Binary',
            click: () => mainWindow.webContents.send('menu-export-linux')
          }
        ]
      },
      { type: 'separator' },
      {
        label: 'Exit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About YUGA Engine',
        click: () => {
          dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'About YUGA Engine',
            message: 'YUGA Engine v1.0.0',
            detail: 'Yielding Unified Game Automation\n\nA next-generation game development engine with AI-powered automation.\n\nBuilt with Electron, Three.js, and React patterns.\n\nLicense: MIT'
          });
        }
      },
      {
        label: 'Documentation',
        click: () => mainWindow.webContents.send('menu-docs')
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
