/**
 * Enhanced state management with Electron integration
 * Handles project persistence, file operations, and app state
 */
import { validateAndSave, loadAndValidate, createNew } from './core/storage.js';

const initial = {
  theme: 'dark',
  playing: false,
  project: { 
    name: 'Untitled Project', 
    createdAt: Date.now(),
    lastSaved: null,
    path: null,
    version: '1.0.0'
  },
  scenes: [],
  assets: [],
  scripts: [],
  animations: [],
  settings: {
    autoSave: true,
    autoSaveInterval: 300000, // 5 minutes
    gridSize: 1,
    snapToGrid: false,
    showGrid: true,
    showAxes: true
  }
};

function loadLocal() {
  try { 
    return JSON.parse(localStorage.getItem('yuga_state')) || initial; 
  }
  catch { 
    return initial; 
  }
}

function saveLocal(state) {
  localStorage.setItem('yuga_state', JSON.stringify(state));
}

export function AppStateProvider(cb) {
  let state = loadLocal();
  const subscribers = new Set([cb]);
  let autoSaveTimer = null;

  function setState(patch) {
    state = { ...state, ...patch };
    saveLocal(state);
    subscribers.forEach(s => s(state));
  }

  function update(fn) {
    state = fn(state);
    saveLocal(state);
    subscribers.forEach(s => s(state));
  }

  function subscribe(fn) { 
    subscribers.add(fn); 
    fn(state); 
    return () => subscribers.delete(fn); 
  }

    /**
   * Save project to file (Electron)
   */
  async function saveProjectToFile() {
    try {
      // Validate before saving
      await validateAndSave('project', state.project);
      await Promise.all(state.scenes.map(scene => validateAndSave('scene', scene)));
      await Promise.all(state.assets.map(asset => validateAndSave('asset', asset)));
      await Promise.all(state.scripts.map(script => validateAndSave('script', script)));
      
      if (window.electronAPI) {
        const result = await window.electronAPI.saveProject(state.project);
        if (result.success) {
          setState({ 
            project: { 
              ...state.project, 
              path: result.path,
              lastSaved: Date.now()
            }
          });
          return { success: true, message: `Project saved to ${result.path}` };
        }
      }
      return { success: false, message: 'Save failed' };
    } catch (err) {
      console.error('Validation error during save:', err);
      return { success: false, message: `Validation error: ${err.message}` };
    }
  }

  /**
   * Load project from file (Electron)
   */
  async function loadProjectFromFile() {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.loadProject();
        if (result.success) {
          const data = result.data;
          
          // Validate loaded data
          const validProject = await loadAndValidate('project', data.project || state.project);
          const validScenes = await Promise.all(
            (data.scenes || []).map(scene => loadAndValidate('scene', scene))
          );
          const validAssets = await Promise.all(
            (data.assets || []).map(asset => loadAndValidate('asset', asset))
          );
          const validScripts = await Promise.all(
            (data.scripts || []).map(script => loadAndValidate('script', script))
          );

          setState({
            project: validProject,
            scenes: validScenes,
            assets: validAssets,
            scripts: validScripts,
            animations: data.animations || []
          });
          return { success: true, message: 'Project loaded and validated' };
        }
      }
      return { success: false, message: 'Load failed' };
    } catch (err) {
      console.error('Validation error during load:', err);
      return { success: false, message: `Validation error: ${err.message}` };
    }
  }

  /**
   * Export game build
   */
  async function exportGame(format = 'webgl') {
    if (window.electronAPI) {
      const result = await window.electronAPI.exportGame(format);
      if (result.success) {
        return { success: true, path: result.path };
      }
    }
    return { success: false };
  }

  /**
   * Setup auto-save
   */
  function setupAutoSave() {
    if (state.settings.autoSave) {
      autoSaveTimer = setInterval(() => {
        saveProjectToFile();
      }, state.settings.autoSaveInterval);
    }
  }

  /**
   * Clear auto-save
   */
  function clearAutoSave() {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
    }
  }

  /**
   * Get full project data
   */
  function getProjectData() {
    return {
      project: state.project,
      scenes: state.scenes,
      assets: state.assets,
      scripts: state.scripts,
      animations: state.animations,
      settings: state.settings
    };
  }

  /**
   * Set project data
   */
  function setProjectData(data) {
    setState({
      project: data.project || state.project,
      scenes: data.scenes || state.scenes,
      assets: data.assets || state.assets,
      scripts: data.scripts || state.scripts,
      animations: data.animations || state.animations,
      settings: data.settings || state.settings
    });
  }

  // Preload from Entities JSON if available
  async function preload() {
    for (const file of ['Entities/Project.json','Entities/Scene.json','Entities/Asset.json','Entities/Script.json','Entities/Animation.json']) {
      try {
        const res = await fetch(`./${file}`);
        if (res.ok) {
          const data = await res.json();
          if (file.includes('Project')) setState({ project: data });
          if (file.includes('Scene')) setState({ scenes: Array.isArray(data) ? data : (data.scenes || []) });
          if (file.includes('Asset')) setState({ assets: Array.isArray(data) ? data : (data.assets || []) });
          if (file.includes('Script')) setState({ scripts: Array.isArray(data) ? data : (data.scripts || []) });
          if (file.includes('Animation')) setState({ animations: Array.isArray(data) ? data : (data.animations || []) });
        }
      } catch {}
    }
  }

  preload();
  setupAutoSave();

  cb({ 
    get state() { return state; }, 
    setState, 
    update, 
    subscribe,
    saveProjectToFile,
    loadProjectFromFile,
    exportGame,
    getProjectData,
    setProjectData,
    clearAutoSave
  });
}
