// Project template and starter content generator
export const PROJECT_TEMPLATES = {
  ADVENTURE_3D: {
    id: '3d-adventure',
    name: '3D Adventure',
    description: 'Third-person adventure game template with character controller and inventory system',
    features: [
      'Character Controller',
      'Inventory System',
      'Quest System',
      'NPC Dialogue',
      'Save/Load System'
    ],
    scenes: ['Main', 'Town', 'Dungeon'],
    defaultAssets: {
      characters: ['Player', 'NPC_Villager', 'NPC_Merchant'],
      environments: ['Terrain_Default', 'Building_House', 'Building_Shop'],
      items: ['Item_Sword', 'Item_Potion', 'Item_Key']
    }
  },
  PLATFORMER_2D: {
    id: '2d-platformer',
    name: '2D Platformer',
    description: 'Side-scrolling platformer with physics-based movement and level editor',
    features: [
      'Physics Movement',
      'Level Editor',
      'Collectibles',
      'Power-ups',
      'Score System'
    ],
    scenes: ['MainMenu', 'Level1', 'Level2'],
    defaultAssets: {
      characters: ['Player_Sprite', 'Enemy_Basic', 'Enemy_Flying'],
      environments: ['Tileset_Ground', 'Tileset_Hazards', 'Background_Sky'],
      items: ['Collectible_Coin', 'Powerup_Jump', 'Powerup_Speed']
    }
  },
  PUZZLE: {
    id: 'puzzle',
    name: 'Puzzle Game',
    description: 'Grid-based puzzle game with level progression and mechanics editor',
    features: [
      'Grid System',
      'Puzzle Mechanics',
      'Level Editor',
      'Progress Saving',
      'Achievement System'
    ],
    scenes: ['Menu', 'LevelSelect', 'Puzzle'],
    defaultAssets: {
      ui: ['UI_Button', 'UI_Panel', 'UI_Icons'],
      tiles: ['Tile_Empty', 'Tile_Wall', 'Tile_Goal'],
      effects: ['Effect_Complete', 'Effect_Error', 'Effect_Hint']
    }
  }
};

export class TemplateGenerator {
  constructor() {
    this.templates = PROJECT_TEMPLATES;
  }

  async generateProject(template, options = {}) {
    const templateConfig = this.templates[template];
    if (!templateConfig) throw new Error('Invalid template');

    // Generate project structure
    const project = {
      name: options.name || 'New Project',
      template: templateConfig.id,
      createdAt: Date.now(),
      features: [...templateConfig.features],
      scenes: await this.generateScenes(templateConfig, options),
      scripts: await this.generateScripts(templateConfig, options),
      assets: await this.generateAssets(templateConfig, options)
    };

    return project;
  }

  async generateScenes(template, options) {
    return template.scenes.map(name => ({
      name,
      objects: this.generateDefaultObjects(name, template)
    }));
  }

  generateDefaultObjects(sceneName, template) {
    const objects = [];

    // Add common objects
    objects.push({
      name: 'Camera',
      components: ['Camera', 'Transform']
    });

    objects.push({
      name: 'Lighting',
      components: ['Light', 'Transform']
    });

    // Add scene-specific objects
    switch (sceneName.toLowerCase()) {
      case 'main':
      case 'mainmenu':
        objects.push({
          name: 'UI_Canvas',
          components: ['Canvas', 'UIManager']
        });
        break;
      case 'level1':
      case 'town':
        objects.push({
          name: 'Player',
          components: ['PlayerController', 'Transform', 'Renderer']
        });
        objects.push({
          name: 'Environment',
          components: ['TerrainRenderer', 'Collider']
        });
        break;
    }

    return objects;
  }

  async generateScripts(template, options) {
    const scripts = [];

    // Generate base scripts
    scripts.push({
      id: 'GameManager.cs',
      language: 'csharp',
      content: this.generateGameManagerScript(template)
    });

    // Generate feature-specific scripts
    template.features.forEach(feature => {
      const scriptName = feature.replace(/\s+/g, '') + '.cs';
      scripts.push({
        id: scriptName,
        language: 'csharp',
        content: this.generateFeatureScript(feature)
      });
    });

    return scripts;
  }

  generateGameManagerScript(template) {
    return `using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    void Awake()
    {
        if (Instance == null) {
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else {
            Destroy(gameObject);
        }
    }

    void Start()
    {
        // Initialize systems
        ${template.features.map(f => 
          `Initialize${f.replace(/\s+/g, '')}();`
        ).join('\n        ')}
    }

    ${template.features.map(f => `
    void Initialize${f.replace(/\s+/g, '')}()
    {
        // TODO: Initialize ${f}
    }`).join('\n')}
}`;
  }

  generateFeatureScript(feature) {
    const className = feature.replace(/\s+/g, '');
    return `using UnityEngine;

public class ${className} : MonoBehaviour
{
    void Start()
    {
        // TODO: Initialize ${feature}
    }

    void Update()
    {
        // TODO: Update ${feature} logic
    }
}`;
  }

  async generateAssets(template, options) {
    const assets = [];

    // Process each asset category
    Object.entries(template.defaultAssets).forEach(([category, items]) => {
      items.forEach(item => {
        assets.push({
          id: item,
          type: category,
          path: `Assets/${category}/${item}`,
          // In real implementation, this would be the actual asset data
          data: null
        });
      });
    });

    return assets;
  }

  getAvailableTemplates() {
    return Object.values(this.templates);
  }

  getTemplateById(id) {
    return Object.values(this.templates).find(t => t.id === id);
  }
}