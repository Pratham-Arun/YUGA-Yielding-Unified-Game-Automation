import React, { useState } from 'react';
import { Brain, Check, X, ExternalLink, Code, Palette, Film, Gamepad2, Zap } from 'lucide-react';
import useStore from '../store/useStore';

const AIModels = () => {
  const { aiModels, setAIModelConfig } = useStore();
  const [activeCategory, setActiveCategory] = useState('code');
  const [editingProvider, setEditingProvider] = useState(null);
  const [tempApiKey, setTempApiKey] = useState('');

  const categories = [
    { id: 'code', name: 'Code & Debug', icon: Code, color: 'from-blue-500 to-cyan-500' },
    { id: 'graphics', name: 'Graphics & Assets', icon: Palette, color: 'from-purple-500 to-pink-500' },
    { id: 'animation', name: 'Animation & Voice', icon: Film, color: 'from-orange-500 to-red-500' },
    { id: 'gameDesign', name: 'Game Design', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
  ];

  const modelProviders = {
    code: [
      {
        id: 'free',
        name: '🆓 Free Models',
        icon: '🎁',
        description: 'DeepSeek, GPT-5-Codex, SWE-1, StarCoder2',
        docs: 'https://openrouter.ai',
        color: 'from-green-500 to-emerald-500',
        tasks: ['Code Generation', 'Debugging', 'Refactoring'],
        free: true
      },
      {
        id: 'openai',
        name: 'OpenAI',
        icon: '🧩',
        description: 'GPT-4, GPT-4 Turbo, GPT-4o, GPT-5',
        docs: 'https://platform.openai.com/docs',
        color: 'from-green-500 to-emerald-500',
        tasks: ['Code Generation', 'Error Fixing', 'Documentation'],
      },
      {
        id: 'anthropic',
        name: 'Anthropic Claude',
        icon: '🧠',
        description: 'Claude 3.5/3.7/4 Sonnet, Opus',
        docs: 'https://docs.anthropic.com',
        color: 'from-orange-500 to-red-500',
        tasks: ['Context-aware Debugging', 'Code Explanation', 'Long Codebases'],
      },
      {
        id: 'google',
        name: 'Google Gemini',
        icon: '⚙️',
        description: 'Gemini 1.5 Pro, 2.5 Pro',
        docs: 'https://ai.google.dev',
        color: 'from-blue-500 to-cyan-500',
        tasks: ['Smart Reasoning', 'Code Search', 'Integration'],
      },
      {
        id: 'xai',
        name: 'X AI Grok',
        icon: '🤖',
        description: 'Grok-3, Grok-3 Mini',
        docs: 'https://x.ai',
        color: 'from-purple-500 to-pink-500',
        tasks: ['Experimental Reasoning', 'Developer-friendly'],
      },
      {
        id: 'ollama',
        name: 'Ollama (Local)',
        icon: '💻',
        description: 'CodeLlama, DeepSeek-Coder, Mixtral',
        docs: 'https://ollama.ai',
        color: 'from-slate-500 to-gray-500',
        tasks: ['Local Inference', 'Offline', 'Free'],
      },
    ],
    graphics: [
      {
        id: 'stability',
        name: 'Stability AI',
        icon: '🎨',
        description: 'Stable Diffusion XL, SD3, SDXL Turbo',
        docs: 'https://stability.ai',
        color: 'from-purple-500 to-pink-500',
        tasks: ['2D Textures', 'Concept Art', 'Open Source'],
      },
      {
        id: 'openai',
        name: 'DALL·E 3',
        icon: '🖼️',
        description: 'DALL·E 3, DALL·E 2',
        docs: 'https://platform.openai.com',
        color: 'from-green-500 to-emerald-500',
        tasks: ['Concept Art', 'UI Assets', 'Icons'],
      },
      {
        id: 'leonardo',
        name: 'Leonardo.Ai',
        icon: '🎭',
        description: 'Leonardo Diffusion, Creative',
        docs: 'https://leonardo.ai',
        color: 'from-orange-500 to-red-500',
        tasks: ['Stylized Art', 'Characters', 'Props'],
      },
      {
        id: 'runway',
        name: 'RunwayML',
        icon: '🎬',
        description: 'Gen-2, Gen-3',
        docs: 'https://runwayml.com',
        color: 'from-blue-500 to-cyan-500',
        tasks: ['AI Video', 'Animated Backgrounds'],
      },
      {
        id: 'meshy',
        name: 'Meshy.ai',
        icon: '🧊',
        description: 'Text-to-3D, Image-to-3D',
        docs: 'https://meshy.ai',
        color: 'from-indigo-500 to-purple-500',
        tasks: ['3D Models', 'Text to 3D', 'Free Plan'],
      },
      {
        id: 'blockade',
        name: 'Blockade Labs',
        icon: '🌅',
        description: 'Skybox AI',
        docs: 'https://skybox.blockadelabs.com',
        color: 'from-cyan-500 to-blue-500',
        tasks: ['360° Skyboxes', 'Environments', 'Free API'],
      },
    ],
    animation: [
      {
        id: 'deepmotion',
        name: 'DeepMotion',
        icon: '🕺',
        description: 'Motion Capture, Animate',
        docs: 'https://deepmotion.com',
        color: 'from-purple-500 to-pink-500',
        tasks: ['Motion Capture', 'Character Animation', 'Video to Motion'],
      },
      {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        icon: '🎙️',
        description: 'TTS Multilingual, Voice Clone',
        docs: 'https://elevenlabs.io',
        color: 'from-green-500 to-emerald-500',
        tasks: ['High-Quality TTS', 'NPC Voices', 'Voice Cloning'],
      },
      {
        id: 'altered',
        name: 'Altered Studio',
        icon: '🎤',
        description: 'Voice Clone, TTS',
        docs: 'https://altered.ai',
        color: 'from-orange-500 to-red-500',
        tasks: ['Voice Cloning', 'Character Voices', 'Free Tier'],
      },
      {
        id: 'rvc',
        name: 'RVC (Local)',
        icon: '🔊',
        description: 'Voice Conversion',
        docs: 'https://github.com/RVC-Project',
        color: 'from-slate-500 to-gray-500',
        tasks: ['Local Voice AI', 'Self-hosted', 'Free'],
      },
    ],
    gameDesign: [
      {
        id: 'openai',
        name: 'GPT-4 (OpenAI)',
        icon: '📖',
        description: 'GPT-4, GPT-4 Turbo',
        docs: 'https://platform.openai.com',
        color: 'from-green-500 to-emerald-500',
        tasks: ['Quest Generation', 'Storyline Logic', 'Mission Design'],
      },
      {
        id: 'anthropic',
        name: 'Claude 3.5',
        icon: '💬',
        description: 'Claude 3.5 Sonnet',
        docs: 'https://docs.anthropic.com',
        color: 'from-orange-500 to-red-500',
        tasks: ['NPC Dialogue', 'Branching Trees', 'Character Writing'],
      },
      {
        id: 'google',
        name: 'Gemini 1.5 Pro',
        icon: '⚖️',
        description: 'Gemini 1.5 Pro',
        docs: 'https://ai.google.dev',
        color: 'from-blue-500 to-cyan-500',
        tasks: ['Game Balancing', 'Economy', 'Stats Prediction'],
      },
      {
        id: 'inworld',
        name: 'Inworld.ai',
        icon: '🎮',
        description: 'NPC AI, Dialogue System',
        docs: 'https://inworld.ai',
        color: 'from-purple-500 to-pink-500',
        tasks: ['AI NPCs', 'Unity SDK', 'Character Personalities'],
      },
    ],
  };

  const handleToggleProvider = (providerId) => {
    const provider = aiModels[activeCategory]?.[providerId] || { enabled: false };
    setAIModelConfig(`${activeCategory}.${providerId}`, { enabled: !provider.enabled });
  };

  const handleSaveApiKey = (providerId) => {
    if (tempApiKey.trim()) {
      setAIModelConfig(`${activeCategory}.${providerId}`, { apiKey: tempApiKey });
      setTempApiKey('');
      setEditingProvider(null);
    }
  };

  const handleEditProvider = (providerId) => {
    setEditingProvider(providerId);
    const provider = aiModels[activeCategory]?.[providerId];
    setTempApiKey(provider?.apiKey || '');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">AI Models</h1>
        <p className="text-slate-400">Configure AI model providers across 4 categories</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                  : 'glass hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Info Banner */}
      <div className="glass rounded-xl p-6 border-l-4 border-indigo-500">
        <div className="flex items-start gap-4">
          <Brain className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold mb-2">
              {activeCategory === 'code' && '🧠 Code Generation & Debugging'}
              {activeCategory === 'graphics' && '🎨 Graphics & Asset Generation'}
              {activeCategory === 'animation' && '🎬 Animation & Voice AI'}
              {activeCategory === 'gameDesign' && '🌐 Game Design & Logic'}
            </h3>
            <p className="text-sm text-slate-400">
              {activeCategory === 'code' && 'AI models for code generation, debugging, refactoring, and documentation.'}
              {activeCategory === 'graphics' && '2D/3D textures, assets, character concepts, scenes, and materials.'}
              {activeCategory === 'animation' && 'Motion capture, voice synthesis, and character animation.'}
              {activeCategory === 'gameDesign' && 'Quest generation, NPC dialogue, game balancing, and storylines.'}
            </p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {modelProviders[activeCategory]?.map((provider) => {
          const config = aiModels[activeCategory]?.[provider.id] || { enabled: false, apiKey: '' };
          const isEditing = editingProvider === provider.id;
          const hasApiKey = config.apiKey && config.apiKey.length > 0;

          return (
            <div key={provider.id} className="glass rounded-2xl p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-2xl`}>
                    {provider.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{provider.name}</h3>
                    <p className="text-sm text-slate-400">{provider.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleProvider(provider.id)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    config.enabled ? 'bg-green-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      config.enabled ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Tasks */}
              <div className="mb-4">
                <div className="text-xs text-slate-400 mb-2">Best for:</div>
                <div className="flex flex-wrap gap-2">
                  {provider.tasks.map((task) => (
                    <span
                      key={task}
                      className="px-2 py-1 bg-slate-800/50 rounded-lg text-xs"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              </div>

              {/* API Key Configuration */}
              {provider.id !== 'ollama' && (
                <div className="mb-4">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="password"
                        placeholder="Enter API key..."
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveApiKey(provider.id)}
                          className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-medium transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingProvider(null);
                            setTempApiKey('');
                          }}
                          className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {hasApiKey ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-slate-400">API Key configured</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-slate-400">No API Key</span>
                          </>
                        )}
                      </div>
                      <button
                        onClick={() => handleEditProvider(provider.id)}
                        className="py-1 px-3 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        {hasApiKey ? 'Update' : 'Configure'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Ollama Endpoint */}
              {provider.id === 'ollama' && (
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="http://localhost:11434"
                    value={config.endpoint || ''}
                    onChange={(e) => setAIModelConfig(provider.id, { endpoint: e.target.value })}
                    className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Documentation Link */}
              <a
                href={provider.docs}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View Documentation
              </a>
            </div>
          );
        })}
      </div>

      {/* Usage Tips */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Model Selection Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
          <div>
            <strong className="text-slate-200">Code Generation:</strong> GPT-4, Claude 3, Gemini
          </div>
          <div>
            <strong className="text-slate-200">Error Fixing:</strong> GPT-4, Claude 3
          </div>
          <div>
            <strong className="text-slate-200">Asset Generation:</strong> Stability AI, SDXL
          </div>
          <div>
            <strong className="text-slate-200">Local/Private:</strong> Ollama with Llama 3
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIModels;
