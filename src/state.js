const initial = {
  theme: 'dark',
  playing: false,
  project: { name: 'Untitled', createdAt: Date.now() },
  scenes: [],
  assets: [],
  scripts: [],
  animations: [],
};

function loadLocal() {
  try { return JSON.parse(localStorage.getItem('yuga_state')) || initial; }
  catch { return initial; }
}

import { validateAndSave, loadAndValidate, createNew } from './core/storage.js';

async function saveLocal(state) {
  // Validate each section before saving
  if (state.project) {
    await validateAndSave('project', state.project);
  }
  if (state.scenes) {
    await Promise.all(state.scenes.map(scene => validateAndSave('scene', scene)));
  }
  if (state.assets) {
    await Promise.all(state.assets.map(asset => validateAndSave('asset', asset)));
  }
  if (state.scripts) {
    await Promise.all(state.scripts.map(script => validateAndSave('script', script)));
  }
  
  localStorage.setItem('yuga_state', JSON.stringify(state));
}

export function AppStateProvider(cb) {
  let state = loadLocal();
  const subscribers = new Set([cb]);

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

  function subscribe(fn) { subscribers.add(fn); fn(state); return () => subscribers.delete(fn); }

  // Attempt to preload and validate from bundled JSON if running via http server
  async function preload() {
    // Best-effort load and validate Entities JSON
    for (const file of ['Entities/Project.json','Entities/Scene.json','Entities/Asset.json','Entities/Script.json','Entities/Animation.json']) {
      try {
        const res = await fetch(`./${file}`);
        if (res.ok) {
          const data = await res.json();
          
          // Validate and transform data before setting state
          if (file.includes('Project')) {
            const validProject = await loadAndValidate('project', data);
            setState({ project: validProject });
          }
          if (file.includes('Scene')) {
            const scenes = Array.isArray(data) ? data : (data.scenes || []);
            const validScenes = await Promise.all(
              scenes.map(scene => loadAndValidate('scene', scene))
            );
            setState({ scenes: validScenes });
          }
          if (file.includes('Asset')) {
            const assets = Array.isArray(data) ? data : (data.assets || []);
            const validAssets = await Promise.all(
              assets.map(asset => loadAndValidate('asset', asset))
            );
            setState({ assets: validAssets });
          }
          if (file.includes('Script')) {
            const scripts = Array.isArray(data) ? data : (data.scripts || []);
            const validScripts = await Promise.all(
              scripts.map(script => loadAndValidate('script', script))
            );
            setState({ scripts: validScripts });
          }
        }
      } catch (err) {
        console.warn(`Failed to load/validate ${file}:`, err);
      }
    }
  }

  preload();

  cb({ get state() { return state; }, setState, update, subscribe });
}
