const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  saveProject: (projectData) => ipcRenderer.invoke('save-project', projectData),
  loadProject: () => ipcRenderer.invoke('load-project'),
  exportGame: (format) => ipcRenderer.invoke('export-game', format),
  // Menu events - return disposer from registration and expose off* helpers
  onNewProject: (callback) => {
    const wrapped = (e) => callback(e);
    ipcRenderer.on('menu-new-project', wrapped);
    return () => ipcRenderer.removeListener('menu-new-project', wrapped);
  },
  offNewProject: (cb) => { if (cb) ipcRenderer.removeListener('menu-new-project', cb); },
  onOpenProject: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-open-project', w); return () => ipcRenderer.removeListener('menu-open-project', w); },
  offOpenProject: (cb) => { if (cb) ipcRenderer.removeListener('menu-open-project', cb); },
  onSaveProject: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-save-project', w); return () => ipcRenderer.removeListener('menu-save-project', w); },
  offSaveProject: (cb) => { if (cb) ipcRenderer.removeListener('menu-save-project', cb); },
  onExportWebGL: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-export-webgl', w); return () => ipcRenderer.removeListener('menu-export-webgl', w); },
  offExportWebGL: (cb) => { if (cb) ipcRenderer.removeListener('menu-export-webgl', cb); },
  onExportWindows: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-export-windows', w); return () => ipcRenderer.removeListener('menu-export-windows', w); },
  offExportWindows: (cb) => { if (cb) ipcRenderer.removeListener('menu-export-windows', cb); },
  onExportMacOS: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-export-macos', w); return () => ipcRenderer.removeListener('menu-export-macos', w); },
  offExportMacOS: (cb) => { if (cb) ipcRenderer.removeListener('menu-export-macos', cb); },
  onExportLinux: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-export-linux', w); return () => ipcRenderer.removeListener('menu-export-linux', w); },
  offExportLinux: (cb) => { if (cb) ipcRenderer.removeListener('menu-export-linux', cb); },
  onDocs: (callback) => { const w = (e) => callback(e); ipcRenderer.on('menu-docs', w); return () => ipcRenderer.removeListener('menu-docs', w); },
  offDocs: (cb) => { if (cb) ipcRenderer.removeListener('menu-docs', cb); },

  // System info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => process.platform,
  getArch: () => process.arch
});
