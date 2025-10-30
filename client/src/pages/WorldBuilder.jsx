/**
 * YUGA Engine - AI World Builder Component
 * 
 * AI-powered world generation using GPT-4, Claude 3.5, and Gemini
 * Inspired by Unity's scene editor and Godot's world composition tools
 */

import React, { useState, useRef } from 'react';
import { 
  Globe, Sparkles, Download, Play, Save, RefreshCw, 
  MapPin, Users, Scroll, Building2, Trees, Mountain,
  Wand2, MessageSquare, BookOpen, Settings
} from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';

export default function WorldBuilder() {
  const { aiModels } = useStore();
  const [worldPrompt, setWorldPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('world'); // world, npcs, quests
  const [generatedWorld, setGeneratedWorld] = useState(null);
  const [npcs, setNpcs] = useState([]);
  const [quests, setQuests] = useState([]);
  const [selectedNPC, setSelectedNPC] = useState(null);

  const worldTemplates = [
    { id: 'medieval-village', name: 'Medieval Village', icon: Building2, description: 'Blacksmith, tavern, market square' },
    { id: 'fantasy-forest', name: 'Fantasy Forest', icon: Trees, description: 'Enchanted trees, mystical creatures' },
    { id: 'mountain-fortress', name: 'Mountain Fortress', icon: Mountain, description: 'Castle, training grounds, armory' },
    { id: 'desert-oasis', name: 'Desert Oasis', icon: MapPin, description: 'Trading post, caravans, bazaar' },
  ];

  const tabs = [
    { id: 'world', name: 'World Builder', icon: Globe },
    { id: 'npcs', name: 'NPC Dialogue', icon: Users },
    { id: 'quests', name: 'Quest Generator', icon: Scroll },
  ];

  // Generate World using AI
  const handleGenerateWorld = async () => {
    if (!worldPrompt.trim()) {
      alert('Please describe the world you want to create');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/ai/generate-world', {
        prompt: worldPrompt,
        models: {
          worldGen: aiModels.gameDesign?.openai?.enabled ? 'gpt-4' : 'claude-3.5-sonnet',
          npcGen: aiModels.gameDesign?.inworld?.enabled ? 'inworld' : 'gpt-4',
          balancing: aiModels.gameDesign?.google?.enabled ? 'gemini-1.5-pro' : 'gpt-4'
        }
      });

      setGeneratedWorld(response.data.world);
      setNpcs(response.data.npcs || []);
      setQuests(response.data.quests || []);
    } catch (error) {
      console.error('World generation failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      if (errorMsg.includes('API key')) {
        alert('⚠️ OpenAI API Key Required!\n\nPlease add your OpenAI API key to the .env file:\nOPENAI_API_KEY=sk-your-key-here\n\nGet your key at: https://platform.openai.com/api-keys');
      } else {
        alert('Failed to generate world: ' + errorMsg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate NPC Dialogue
  const handleGenerateDialogue = async (npc) => {
    // Set loading state for this specific NPC
    setNpcs(npcs.map(n => 
      n.id === npc.id 
        ? { ...n, isGeneratingDialogue: true }
        : n
    ));

    try {
      const response = await axios.post('/api/ai/generate-npc-dialogue', {
        npc: npc,
        context: generatedWorld?.description || '',
        model: aiModels.gameDesign?.anthropic?.enabled ? 'claude-3.5-sonnet' : 'gpt-4'
      });

      // Update NPC with dialogue and remove loading state
      setNpcs(npcs.map(n => 
        n.id === npc.id 
          ? { ...n, dialogue: response.data.dialogue, isGeneratingDialogue: false }
          : n
      ));
    } catch (error) {
      console.error('Dialogue generation failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      if (errorMsg.includes('API key')) {
        alert('⚠️ OpenAI API Key Required!\n\nPlease add your OpenAI API key to the .env file.');
      } else {
        alert('Failed to generate dialogue: ' + errorMsg);
      }
      // Remove loading state on error
      setNpcs(npcs.map(n => 
        n.id === npc.id 
          ? { ...n, isGeneratingDialogue: false }
          : n
      ));
    }
  };

  // Generate Quest
  const handleGenerateQuest = async (questPrompt) => {
    if (!questPrompt || !questPrompt.trim()) {
      alert('Please enter a quest description');
      return;
    }

    try {
      const response = await axios.post('/api/ai/generate-quest', {
        prompt: questPrompt,
        world: generatedWorld,
        npcs: npcs,
        model: 'gpt-4'
      });

      // Add new quest to the list
      setQuests([...quests, response.data.quest]);
    } catch (error) {
      console.error('Quest generation failed:', error);
      const errorMsg = error.response?.data?.error || error.message;
      if (errorMsg.includes('API key')) {
        alert('⚠️ OpenAI API Key Required!\n\nPlease add your OpenAI API key to the .env file.');
      } else {
        alert('Failed to generate quest: ' + errorMsg);
      }
    }
  };

  // Export to Unity/Godot format
  const handleExportWorld = () => {
    const worldData = {
      world: generatedWorld,
      npcs: npcs,
      quests: quests,
      format: 'unity-prefab',
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(worldData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `world-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Templates & Settings */}
      <div className="w-80 glass-dark border-r border-white/10 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Globe className="w-6 h-6 text-purple-400" />
          AI World Builder
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Generate complete worlds with AI
        </p>

        {/* World Prompt */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Describe Your World</label>
          <textarea
            value={worldPrompt}
            onChange={(e) => setWorldPrompt(e.target.value)}
            placeholder="e.g., A medieval blacksmith village with a bustling market, ancient forge, and mysterious travelers..."
            className="w-full h-32 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        {/* Quick Templates */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Quick Templates</label>
          <div className="space-y-2">
            {worldTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => setWorldPrompt(template.description)}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors border border-white/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-medium">{template.name}</span>
                  </div>
                  <p className="text-xs text-slate-400">{template.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Models Status */}
        <div className="glass rounded-lg p-3 mb-6">
          <div className="text-xs font-medium text-slate-400 mb-2">Active AI Models</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span>World Gen:</span>
              <span className="text-green-400">
                {aiModels.gameDesign?.openai?.enabled ? 'GPT-4' : 'Claude 3.5'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>NPC AI:</span>
              <span className="text-green-400">
                {aiModels.gameDesign?.inworld?.enabled ? 'Inworld.ai' : 'GPT-4'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Balancing:</span>
              <span className="text-green-400">
                {aiModels.gameDesign?.google?.enabled ? 'Gemini 1.5' : 'GPT-4'}
              </span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateWorld}
          disabled={isGenerating || !worldPrompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating World...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              Generate World
            </>
          )}
        </button>

        {/* Export Button */}
        {generatedWorld && (
          <button
            onClick={handleExportWorld}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to Unity/Godot
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="glass-dark border-b border-white/10 p-4">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'hover:bg-white/5 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {!generatedWorld ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Globe className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">
                No World Generated Yet
              </h3>
              <p className="text-sm text-slate-500 max-w-md">
                Describe your world in the sidebar and click "Generate World" to create
                a complete game environment with buildings, NPCs, and quests.
              </p>
            </div>
          ) : (
            <>
              {/* World Builder Tab */}
              {activeTab === 'world' && (
                <div className="space-y-6">
                  {/* World Overview */}
                  <div className="glass rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-4">{generatedWorld.name}</h2>
                    <p className="text-slate-300 mb-4">{generatedWorld.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-400">{generatedWorld.buildings?.length || 0}</div>
                        <div className="text-xs text-slate-400">Buildings</div>
                      </div>
                      <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-pink-400">{npcs.length}</div>
                        <div className="text-xs text-slate-400">NPCs</div>
                      </div>
                      <div className="glass-dark rounded-lg p-4">
                        <div className="text-2xl font-bold text-indigo-400">{quests.length}</div>
                        <div className="text-xs text-slate-400">Quests</div>
                      </div>
                    </div>

                    {/* Buildings List */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Buildings & Locations</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {generatedWorld.buildings?.map((building, idx) => (
                          <div key={idx} className="glass-dark rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Building2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                              <div>
                                <div className="font-medium mb-1">{building.name}</div>
                                <div className="text-xs text-slate-400 mb-2">{building.type}</div>
                                <div className="text-xs text-slate-500">{building.description}</div>
                                {building.position && (
                                  <div className="text-xs text-slate-600 mt-2">
                                    Position: ({building.position.x}, {building.position.y}, {building.position.z})
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* NPC Dialogue Tab */}
              {activeTab === 'npcs' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">NPCs & Dialogue</h2>
                    <span className="text-sm text-slate-400">{npcs.length} characters</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {npcs.map((npc) => (
                      <div key={npc.id} className="glass rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{npc.name}</h3>
                            <p className="text-sm text-slate-400">{npc.role}</p>
                          </div>
                          <button
                            onClick={() => handleGenerateDialogue(npc)}
                            disabled={npc.isGeneratingDialogue}
                            className={`p-2 rounded-lg transition-colors ${
                              npc.isGeneratingDialogue 
                                ? 'bg-purple-600 cursor-wait' 
                                : 'hover:bg-white/5'
                            }`}
                            title={npc.isGeneratingDialogue ? 'Generating...' : 'Generate Dialogue'}
                          >
                            {npc.isGeneratingDialogue ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <MessageSquare className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        <p className="text-sm text-slate-300 mb-4">{npc.personality}</p>

                        {npc.dialogue && (
                          <div className="glass-dark rounded-lg p-3 space-y-2">
                            <div className="text-xs font-medium text-slate-400">Sample Dialogue:</div>
                            {npc.dialogue.map((line, idx) => (
                              <div key={idx} className="text-sm text-slate-300 italic">
                                "{line}"
                              </div>
                            ))}
                          </div>
                        )}

                        {npc.inworldId && (
                          <div className="mt-3 text-xs text-green-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Inworld.ai Connected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quest Generator Tab */}
              {activeTab === 'quests' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Generated Quests</h2>
                    <button
                      onClick={() => {
                        const questPrompt = prompt('Describe the quest you want to create:');
                        if (questPrompt) handleGenerateQuest(questPrompt);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Wand2 className="w-4 h-4" />
                      Generate New Quest
                    </button>
                  </div>

                  <div className="space-y-4">
                    {quests.map((quest, idx) => (
                      <div key={idx} className="glass rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <Scroll className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{quest.title}</h3>
                            <p className="text-sm text-slate-300 mb-4">{quest.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-xs text-slate-400 mb-1">Quest Giver</div>
                                <div className="text-sm font-medium">{quest.questGiver}</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-400 mb-1">Reward</div>
                                <div className="text-sm font-medium text-yellow-400">{quest.reward}</div>
                              </div>
                            </div>

                            {quest.objectives && (
                              <div className="glass-dark rounded-lg p-3">
                                <div className="text-xs font-medium text-slate-400 mb-2">Objectives:</div>
                                <ul className="space-y-1">
                                  {quest.objectives.map((obj, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-purple-400">•</span>
                                      {obj}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {quests.length === 0 && (
                      <div className="text-center py-12 text-slate-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No quests generated yet. Click "Generate New Quest" to create one.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
