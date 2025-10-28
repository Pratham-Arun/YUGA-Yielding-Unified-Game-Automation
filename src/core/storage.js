import { validate } from './validation.js';

// Helper function to validate data before saving
export async function validateAndSave(type, data, path) {
  const { isValid, errors } = validate(type, data);
  
  if (!isValid) {
    console.error(`Invalid ${type} data:`, errors);
    throw new Error(`Invalid ${type} data: ${JSON.stringify(errors)}`);
  }

  // In a real app, this would save to IndexedDB, filesystem, etc.
  try {
    // For now just return true to indicate success
    return true;
  } catch (err) {
    console.error(`Error saving ${type}:`, err);
    throw err;
  }
}

// Helper to load and validate data
export async function loadAndValidate(type, path) {
  try {
    // In a real app, this would load from storage
    const data = {}; // Placeholder
    
    const { isValid, errors } = validate(type, data);
    
    if (!isValid) {
      console.error(`Invalid ${type} data loaded:`, errors);
      throw new Error(`Invalid ${type} data loaded: ${JSON.stringify(errors)}`);
    }

    return data;
  } catch (err) {
    console.error(`Error loading ${type}:`, err);
    throw err;
  }
}

// Migration helper
export async function migrateData(type, data, fromVersion, toVersion) {
  // Add version migration logic here as needed
  return data;
}

// Helper to create new objects with defaults
export function createNew(type) {
  const templates = {
    project: {
      name: 'New Project',
      project_type: '3d_game',
      template: 'blank',
      settings: {
        resolution_width: 1920,
        resolution_height: 1080,
        target_framerate: 60,
        physics_enabled: true
      }
    },
    scene: {
      name: 'New Scene',
      objects: [],
      camera: {
        position: { x: 0, y: 5, z: 10 },
        fov: 75
      }
    },
    asset: {
      name: 'New Asset',
      type: 'mesh',
      data: {}
    },
    script: {
      name: 'New Script',
      code: '// New script\n'
    }
  };

  const template = templates[type];
  if (!template) {
    throw new Error(`Unknown type: ${type}`);
  }

  return {
    ...template,
    id: crypto.randomUUID(),
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: '1.0.0'
    }
  };
}