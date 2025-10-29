// Use ESM-compatible Ajv for the browser
import Ajv from 'https://esm.sh/ajv@6.12.6';

const ajv = new Ajv();

// Schema definitions
export const schemas = {
  project: {
    type: 'object',
    required: ['name', 'project_type'],
    properties: {
      name: { 
        type: 'string',
        description: 'Project name'
      },
      description: {
        type: 'string',
        description: 'Project description'
      },
      project_type: {
        type: 'string',
        enum: ['3d_game', '2d_game', 'vr_experience', 'mobile_game', 'web_game'],
        default: '3d_game'
      },
      template: {
        type: 'string',
        enum: ['blank', 'fps', 'platformer', 'rpg', 'puzzle', 'racing'],
        default: 'blank'
      },
      thumbnail_url: {
        type: 'string',
        description: 'Project thumbnail'
      },
      settings: {
        type: 'object',
        properties: {
          resolution_width: {
            type: 'number',
            default: 1920
          },
          resolution_height: {
            type: 'number',
            default: 1080
          },
          target_framerate: {
            type: 'number',
            default: 60
          },
          physics_enabled: {
            type: 'boolean',
            default: true
          }
        }
      },
      last_opened: {
        type: 'string',
        format: 'date-time'
      },
      // Extended properties
      scenes: {
        type: 'array',
        items: { type: 'string' },
        description: 'Scene IDs'
      },
      assets: {
        type: 'array',
        items: { type: 'string' },
        description: 'Asset IDs'
      },
      scripts: {
        type: 'array',
        items: { type: 'string' },
        description: 'Script IDs'
      },
      metadata: {
        type: 'object',
        properties: {
          created: { type: 'string', format: 'date-time' },
          modified: { type: 'string', format: 'date-time' },
          version: { type: 'string' }
        }
      }
    }
  },
  scene: {
    type: 'object',
    required: ['project_id', 'name'],
    properties: {
      project_id: {
        type: 'string',
        description: 'Parent project ID'
      },
      name: {
        type: 'string',
        description: 'Scene name'
      },
      objects: {
        type: 'array',
        description: 'Scene objects hierarchy',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            type: {
              type: 'string',
              enum: ['Node3D', 'MeshNode', 'CameraNode', 'LightNode']
            },
            position: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                z: { type: 'number' }
              }
            },
            rotation: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
                z: { type: 'number' }
              }
            },
            scale: {
              type: 'object',
              properties: {
                x: { type: 'number', default: 1 },
                y: { type: 'number', default: 1 },
                z: { type: 'number', default: 1 }
              }
            },
            children: {
              type: 'array',
              items: {
                type: 'string'
              }
            }
          }
        }
      },
      camera: {
        type: 'object',
        properties: {
          position: {
            type: 'object',
            properties: {
              x: { type: 'number', default: 0 },
              y: { type: 'number', default: 5 },
              z: { type: 'number', default: 10 }
            }
          },
          fov: {
            type: 'number',
            default: 75
          }
        }
      }
    }
  },
  asset: {
    type: 'object',
    required: ['id', 'name', 'type', 'data'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: {
        type: 'string',
        enum: ['mesh', 'material', 'texture', 'audio', 'script']
      },
      data: { type: 'object' },
      metadata: {
        type: 'object',
        properties: {
          created: { type: 'string', format: 'date-time' },
          modified: { type: 'string', format: 'date-time' },
          size: { type: 'number' }
        }
      }
    }
  },
  script: {
    type: 'object',
    required: ['id', 'name', 'code'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      code: { type: 'string' },
      metadata: {
        type: 'object',
        properties: {
          created: { type: 'string', format: 'date-time' },
          modified: { type: 'string', format: 'date-time' },
          version: { type: 'string' }
        }
      }
    }
  }
};

// Compile validators
const validators = {};
for (const [key, schema] of Object.entries(schemas)) {
  validators[key] = ajv.compile(schema);
}

// Validation functions
export function validateProject(data) {
  return validators.project(data);
}

export function validateScene(data) {
  return validators.scene(data);
}

export function validateAsset(data) {
  return validators.asset(data);
}

export function validateScript(data) {
  return validators.script(data);
}

// Utility to validate any type of data
export function validate(type, data) {
  const validator = validators[type];
  if (!validator) {
    throw new Error(`No validator found for type: ${type}`);
  }
  const isValid = validator(data);
  return {
    isValid,
    errors: validator.errors
  };
}