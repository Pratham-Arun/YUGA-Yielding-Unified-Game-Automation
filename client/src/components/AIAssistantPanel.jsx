import React, { useState } from 'react';
import { 
  Sparkles, 
  FileCode, 
  BookOpen, 
  Wrench, 
  TestTube, 
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import axios from 'axios';

const AIAssistantPanel = ({ code, language, selectedModel, onCodeUpdate }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const tabs = [
    { id: 'generate', label: 'Generate', icon: Sparkles },
    { id: 'explain', label: 'Explain', icon: BookOpen },
    { id: 'refactor', label: 'Refactor', icon: Wrench },
    { id: 'tests', label: 'Tests', icon: TestTube },
    { id: 'docs', label: 'Docs', icon: FileCode }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/api/ai/generate-advanced', {
        prompt,
        model: selectedModel,
        language,
        includeTests: false,
        multiFile: false
      });

      setResult(response.data);
      if (response.data.code) {
        onCodeUpdate(response.data.code);
      }
    } catch (error) {
      console.error('Generation error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      setResult({ error: 'No code to explain' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/api/ai/explain-code', {
        code,
        language,
        model: selectedModel
      });

      setResult({ explanation: response.data.explanation });
    } catch (error) {
      console.error('Explanation error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRefactor = async () => {
    if (!code.trim()) {
      setResult({ error: 'No code to refactor' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/api/ai/refactor-code', {
        code,
        language,
        model: selectedModel
      });

      setResult(response.data);
      if (response.data.refactoredCode) {
        onCodeUpdate(response.data.refactoredCode);
      }
    } catch (error) {
      console.error('Refactor error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTests = async () => {
    if (!code.trim()) {
      setResult({ error: 'No code to test' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/api/ai/generate-tests', {
        code,
        language,
        model: selectedModel
      });

      setResult({ tests: response.data.tests });
    } catch (error) {
      console.error('Test generation error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocs = async () => {
    if (!code.trim()) {
      setResult({ error: 'No code to document' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/api/ai/generate-docs', {
        code,
        language,
        model: selectedModel
      });

      setResult({ documentation: response.data.documentation });
    } catch (error) {
      console.error('Documentation error:', error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    switch (activeTab) {
      case 'generate':
        handleGenerate();
        break;
      case 'explain':
        handleExplain();
        break;
      case 'refactor':
        handleRefactor();
        break;
      case 'tests':
        handleGenerateTests();
        break;
      case 'docs':
        handleGenerateDocs();
        break;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </div>

      {expanded && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setResult(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Generate Tab */}
            {activeTab === 'generate' && (
              <div className="space-y-3">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to create... e.g., 'Create a player controller with WASD movement'"
                  className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            )}

            {/* Other Tabs Info */}
            {activeTab === 'explain' && (
              <p className="text-sm text-slate-400">
                Click "Explain Code" to get a detailed explanation of your current code
              </p>
            )}

            {activeTab === 'refactor' && (
              <p className="text-sm text-slate-400">
                Click "Refactor Code" to improve your code with best practices
              </p>
            )}

            {activeTab === 'tests' && (
              <p className="text-sm text-slate-400">
                Click "Generate Tests" to create unit tests for your code
              </p>
            )}

            {activeTab === 'docs' && (
              <p className="text-sm text-slate-400">
                Click "Generate Docs" to create comprehensive documentation
              </p>
            )}

            {/* Action Button */}
            <button
              onClick={handleAction}
              disabled={loading || (activeTab === 'generate' && !prompt.trim())}
              className="w-full gradient-btn px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  {activeTab === 'generate' && 'Generate Code'}
                  {activeTab === 'explain' && 'Explain Code'}
                  {activeTab === 'refactor' && 'Refactor Code'}
                  {activeTab === 'tests' && 'Generate Tests'}
                  {activeTab === 'docs' && 'Generate Docs'}
                </>
              )}
            </button>

            {/* Result Display */}
            {result && (
              <div className="mt-4 space-y-3">
                {result.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{result.error}</p>
                  </div>
                )}

                {result.explanation && (
                  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Explanation</h4>
                      <button
                        onClick={() => copyToClipboard(result.explanation)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-slate-300">
                        {result.explanation}
                      </pre>
                    </div>
                  </div>
                )}

                {result.refactoredCode && (
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <h4 className="font-semibold text-sm text-green-400 mb-2">Changes Made:</h4>
                      <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                        {result.changes?.map((change, i) => (
                          <li key={i}>{change}</li>
                        ))}
                      </ul>
                      {result.explanation && (
                        <p className="mt-2 text-sm text-slate-400">{result.explanation}</p>
                      )}
                    </div>
                  </div>
                )}

                {result.tests && (
                  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Generated Tests</h4>
                      <button
                        onClick={() => copyToClipboard(result.tests)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <pre className="bg-slate-900/50 rounded p-3 overflow-x-auto text-sm">
                      <code>{result.tests}</code>
                    </pre>
                  </div>
                )}

                {result.documentation && (
                  <div className="bg-slate-800/50 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">Documentation</h4>
                      <button
                        onClick={() => copyToClipboard(result.documentation)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-slate-300">
                        {result.documentation}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistantPanel;
