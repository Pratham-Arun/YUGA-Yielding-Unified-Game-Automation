// Asset generation system
export const ASSET_TYPES = {
  MODEL_3D: '3d',
  TEXTURE: 'texture',
  CHARACTER: 'character',
  ENVIRONMENT: 'environment'
};

export const ART_STYLES = {
  REALISTIC: {
    id: 'realistic',
    name: 'Realistic',
    description: 'Photorealistic assets with high detail and physically accurate materials'
  },
  STYLIZED: {
    id: 'stylized',
    name: 'Stylized',
    description: 'Artistic and exaggerated style similar to popular animated games'
  },
  LOW_POLY: {
    id: 'low-poly',
    name: 'Low Poly',
    description: 'Minimalist style with faceted surfaces, perfect for mobile games'
  },
  PIXEL: {
    id: 'pixel',
    name: 'Pixel Art',
    description: 'Classic pixel art style reminiscent of retro games'
  },
  HAND_PAINTED: {
    id: 'hand-painted',
    name: 'Hand Painted',
    description: 'Artistic style with visible brushstrokes and painted textures'
  }
};

export const QUALITY_SETTINGS = {
  DRAFT: {
    id: 'draft',
    name: 'Draft',
    resolution: 512,
    samples: 16,
    description: 'Quick preview with basic detail'
  },
  STANDARD: {
    id: 'standard',
    name: 'Standard',
    resolution: 1024,
    samples: 32,
    description: 'Balanced quality and performance'
  },
  HIGH: {
    id: 'high',
    name: 'High',
    resolution: 2048,
    samples: 64,
    description: 'High quality with detailed textures'
  },
  ULTRA: {
    id: 'ultra',
    name: 'Ultra',
    resolution: 4096,
    samples: 128,
    description: 'Maximum quality for close-up details'
  }
};