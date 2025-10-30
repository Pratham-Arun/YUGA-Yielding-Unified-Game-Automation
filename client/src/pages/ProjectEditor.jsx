import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { 
  Save, 
  Play, 
  Sparkles, 
  Code, 
  FileCode,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';
import AIAssistantPanel from '../components/AIAssistantPanel';

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, setCurrentProject, selectedModel, setSelectedModel, aiModels } = useStore();
  const [code, setCode] = useState('// Start coding...\n');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState('csharp');

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${id}`);
      setCurrentProject(response.data);
      
      // Load first script if exists
      if (response.data.data?.scripts?.length > 0) {
        setCode(response.data.data.scripts[0].content);
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  };

  const handleSave = async () => {
    if (!currentProject) return;

    try {
      const updatedData = {
        ...currentProject.data,
        scripts: [
          {
            name: 'main.cs',
            content: code,
            language: language,
          }
        ],
      };

      await axios.post('/api/projects', {
        id: currentProject.id,
        name: currentProject.name,
        data: updatedData,
      });

      alert('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    }
  };

  // Get available AI models
  const getAvailableModels = () => {
    const models = [];
    
    // Always show free models first from code category
    if (aiModels.code?.free?.enabled) {
      models.push(
        { value: 'deepseek-r1-0528', label: '🆓 DeepSeek R1 (Free)', provider: 'free', free: true },
        { value: 'deepseek-v3-0324', label: '🆓 DeepSeek V3 (Free)', provider: 'free', free: true },
        { value: 'gpt-5-codex', label: '🆓 GPT-5 Codex (Free)', provider: 'free', free: true },
        { value: 'swe-1', label: '🆓 SWE-1 (Free)', provider: 'free', free: true },
        { value: 'grok-code-fast-1', label: '🆓 Grok Code Fast (Free)', provider: 'free', free: true }
      );
    }
    
    if (aiModels.code?.openai?.enabled) {
      models.push(
        { value: 'gpt-4', label: 'GPT-4 (OpenAI)', provider: 'openai' },
        { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (OpenAI)', provider: 'openai' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)', provider: 'openai' }
      );
    }
    if (aiModels.code?.anthropic?.enabled) {
      models.push(
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus (Anthropic)', provider: 'anthropic' },
        { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet (Anthropic)', provider: 'anthropic' },
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku (Anthropic)', provider: 'anthropic' }
      );
    }
    if (aiModels.code?.google?.enabled) {
      models.push(
        { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Google)', provider: 'google' },
        { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Google)', provider: 'google' }
      );
    }
    return models;
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    if (!selectedModel) {
      alert('Please select an AI model from the dropdown');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('/api/ai/generate-code', {
        prompt: aiPrompt,
        model: selectedModel,
        language: language,
      });

      setCode(response.data.code);
      setAiPrompt('');
    } catch (error) {
      console.error('Failed to generate code:', error);
      alert('Failed to generate code. Make sure AI models are configured.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{currentProject.name}</h1>
              <p className="text-sm text-slate-400">Unity C# Script Editor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
            </select>
            
            <select
              value={selectedModel || ''}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
            >
              <option value="">Select AI Model</option>
              {getAvailableModels().map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* AI Prompt Bar */}
      <div className="glass-dark border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Ask AI to generate code... (e.g., 'Create a player controller with WASD movement')"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAIGenerate()}
            disabled={isGenerating}
            className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
          <button
            onClick={handleAIGenerate}
            disabled={isGenerating || !aiPrompt.trim()}
            className="gradient-btn px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-4">
        {/* Monaco Editor */}
        <div className="flex-1 glass rounded-xl overflow-hidden">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* AI Assistant Panel */}
        <div className="w-96">
          <AIAssistantPanel
            code={code}
            language={language}
            selectedModel={selectedModel}
            onCodeUpdate={setCode}
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="glass-dark border-t border-white/10 p-2 px-4">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              {language.toUpperCase()}
            </span>
            <span>{code.split('\n').length} lines</span>
          </div>
          <div className="flex items-center gap-2">
            {selectedModel ? (
              <span className="flex items-center gap-2 text-green-400">
                <Sparkles className="w-4 h-4" />
                AI: {selectedModel}
              </span>
            ) : (
              <span className="text-yellow-400">No AI model selected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditor;
