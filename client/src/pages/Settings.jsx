import React, { useState } from 'react';
import { Settings as SettingsIcon, Zap, Database, Moon, Sun } from 'lucide-react';
import useStore from '../store/useStore';

const Settings = () => {
  const { 
    unityConnected, 
    unityEndpoint, 
    setUnityEndpoint, 
    setUnityConnected,
    theme,
    setTheme 
  } = useStore();
  
  const [tempEndpoint, setTempEndpoint] = useState(unityEndpoint);

  const handleTestConnection = async () => {
    try {
      const response = await fetch(`${tempEndpoint}/health`);
      if (response.ok) {
        setUnityConnected(true);
        setUnityEndpoint(tempEndpoint);
        alert('Successfully connected to Unity!');
      } else {
        setUnityConnected(false);
        alert('Failed to connect to Unity');
      }
    } catch (error) {
      setUnityConnected(false);
      alert('Failed to connect to Unity. Make sure Unity is running with the YUGA plugin.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-slate-400">Configure your YUGA Engine preferences</p>
      </div>

      {/* Unity Integration */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Unity 6 Integration</h2>
            <p className="text-sm text-slate-400">Connect YUGA to your Unity editor</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Unity API Endpoint</label>
            <input
              type="text"
              value={tempEndpoint}
              onChange={(e) => setTempEndpoint(e.target.value)}
              placeholder="http://localhost:8080"
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-400 mt-2">
              Install the YUGA Unity plugin and start the API server in Unity
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${unityConnected ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm">
                {unityConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <button
              onClick={handleTestConnection}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-sm text-slate-400">Customize the look and feel</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Moon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Dark</div>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Sun className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Light</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Database Info */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Database</h2>
            <p className="text-sm text-slate-400">Local SQLite database</p>
          </div>
        </div>

        <div className="text-sm text-slate-400 space-y-2">
          <p>All your projects are stored locally in a SQLite database.</p>
          <p className="font-mono text-xs bg-slate-800/50 p-2 rounded">./yuga.db</p>
        </div>
      </div>

      {/* About */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">About YUGA Engine</h2>
        <div className="text-sm text-slate-400 space-y-2">
          <p><strong className="text-slate-200">Version:</strong> 2.0.0</p>
          <p><strong className="text-slate-200">Description:</strong> Yielding Unified Game Automation</p>
          <p><strong className="text-slate-200">Stack:</strong> React + Tailwind + Monaco + Node.js + Express + LangChain</p>
          <p><strong className="text-slate-200">License:</strong> MIT</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
