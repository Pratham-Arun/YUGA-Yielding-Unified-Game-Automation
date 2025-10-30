import React, { useState } from "react";
import {
  Palette,
  Box,
  User,
  Mountain,
  Sword,
  Shield,
  Crown,
  Wand2,
  Download,
  Copy,
  Sparkles,
  Image,
  Settings,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function AssetGenerator() {
  const [selectedCategory, setSelectedCategory] = useState("3D Models");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Fantasy");
  const [quality, setQuality] = useState("High");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState([]);

  const categories = [
    { name: "3D Models", icon: Box, description: "Characters, weapons, props" },
    { name: "Textures", icon: Palette, description: "Materials and surfaces" },
    { name: "Characters", icon: User, description: "NPCs and player models" },
    { name: "Environments", icon: Mountain, description: "Landscapes and scenes" },
  ];

  const styles = ["Fantasy", "Sci-Fi", "Realistic", "Cartoon", "Steampunk", "Medieval", "Modern", "Post-Apocalyptic"];
  const qualities = ["Draft", "Medium", "High", "Ultra"];

  const assetTemplates = [
    {
      category: "3D Models",
      items: [
        { name: "Medieval Sword", prompt: "Create a medieval longsword with intricate crossguard and leather-wrapped hilt" },
        { name: "Magic Staff", prompt: "Generate a wizard staff with glowing crystal orb and carved wooden shaft" },
        { name: "Treasure Chest", prompt: "Design an ornate treasure chest with gold trim and iron reinforcements" },
        { name: "Castle Tower", prompt: "Build a medieval stone tower with battlements and arrow slits" },
      ]
    },
    {
      category: "Characters", 
      items: [
        { name: "Blacksmith NPC", prompt: "Create a burly blacksmith character with apron and hammer" },
        { name: "Elven Archer", prompt: "Design an elegant elf archer with bow and quiver" },
        { name: "Dragon Creature", prompt: "Generate a fearsome dragon with scales and wings" },
        { name: "Knight Warrior", prompt: "Create an armored knight with sword and shield" },
      ]
    },
    {
      category: "Environments",
      items: [
        { name: "Forge Interior", prompt: "Design a medieval blacksmith forge with anvil, bellows, and glowing coals" },
        { name: "Dungeon Corridor", prompt: "Create a dark stone dungeon hallway with torches and moss" },
        { name: "Forest Clearing", prompt: "Generate a peaceful forest glade with sunbeams and flowers" },
        { name: "Mountain Peak", prompt: "Build a snow-capped mountain summit with rocky cliffs" },
      ]
    }
  ];

  const recentAssets = [
    {
      name: "Dragon Sword",
      category: "3D Models",
      style: "Fantasy",
      time: "5 minutes ago",
      thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop"
    },
    {
      name: "Fire Elemental",
      category: "Characters", 
      style: "Fantasy",
      time: "20 minutes ago",
      thumbnail: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=200&h=200&fit=crop"
    },
    {
      name: "Ancient Ruins",
      category: "Environments",
      style: "Medieval",
      time: "1 hour ago",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop"
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate asset generation
    setTimeout(() => {
      const newAsset = {
        name: prompt.split(' ').slice(0, 2).join(' '),
        category: selectedCategory,
        style: style,
        time: "Just now",
        thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop"
      };
      
      setGeneratedAssets([newAsset, ...generatedAssets]);
      setIsGenerating(false);
    }, 3000);
  };

  const currentTemplates = assetTemplates.find(cat => cat.category === selectedCategory)?.items || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-4">
              <Palette size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Asset Generator
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create 3D models, textures, characters, and environments with AI
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Asset Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.name;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full p-3 rounded-lg transition-colors text-left ${
                        isActive
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <Icon size={18} className="mr-2" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {category.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recent Assets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Assets
              </h3>
              <div className="space-y-3">
                {recentAssets.map((asset, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={asset.thumbnail}
                      alt={asset.name}
                      className="w-12 h-12 rounded-lg object-cover mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {asset.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {asset.category} • {asset.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Generation Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Generation Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Generate {selectedCategory}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Style Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Art Style
                  </label>
                  <select 
                    value={style} 
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {styles.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Quality Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quality Level
                  </label>
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {qualities.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Describe Your Asset
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={`Example: Create a ${selectedCategory.toLowerCase()} with detailed textures and ${style.toLowerCase()} styling...`}
                  className="w-full h-24 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Forging Asset...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="mr-3" />
                    Generate Asset
                  </>
                )}
              </button>
            </div>

            {/* Quick Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Templates for {selectedCategory}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(template.prompt)}
                    className="p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900 dark:text-white mb-2">
                      {template.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {template.prompt}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Assets Display */}
            {generatedAssets.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Generated Assets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {generatedAssets.map((asset, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3 flex items-center justify-center">
                        <Box size={48} className="text-white" />
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white mb-1">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {asset.style} • {asset.category}
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors flex items-center justify-center">
                          <Download size={16} className="mr-1" />
                          Download
                        </button>
                        <button className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Capabilities */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Zap size={24} className="mr-3" />
                <h3 className="text-xl font-semibold">AI Asset Forge Capabilities</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Smart Generation</h4>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• Contextual asset creation</li>
                    <li>• Style-consistent outputs</li>
                    <li>• Unity-ready formats</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Advanced Features</h4>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• LOD optimization</li>
                    <li>• Texture variations</li>
                    <li>• Animation rigging</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}