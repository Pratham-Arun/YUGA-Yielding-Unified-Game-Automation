import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  FolderKanban, 
  Brain, 
  Zap, 
  TrendingUp,
  Activity,
  Code,
  Sparkles
} from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';

const Dashboard = () => {
  const { projects, setProjects, aiModels } = useStore();
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeModels: 0,
    codeGenerated: 0,
    assetsCreated: 0,
  });

  useEffect(() => {
    loadProjects();
    calculateStats();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const calculateStats = () => {
    const activeModels = Object.values(aiModels).filter(m => m.enabled).length;
    setStats({
      totalProjects: projects.length,
      activeModels,
      codeGenerated: Math.floor(Math.random() * 10000), // Placeholder
      assetsCreated: Math.floor(Math.random() * 500), // Placeholder
    });
  };

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: 'from-blue-500 to-cyan-500' },
    { label: 'Active AI Models', value: stats.activeModels, icon: Brain, color: 'from-purple-500 to-pink-500' },
    { label: 'Lines Generated', value: stats.codeGenerated, icon: Code, color: 'from-green-500 to-emerald-500' },
    { label: 'Assets Created', value: stats.assetsCreated, icon: Sparkles, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
        {/* Background Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 blur-3xl" />
        
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/yuga-logo.png" 
              alt="YUGA Engine Logo" 
              className="w-32 h-32 object-contain"
            />
          </div>
          
          {/* Welcome Text */}
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Welcome to</span>
          </h1>
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Yielding Unified Game Automation
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            AI-Powered Game Development Platform
          </p>
          
          {/* CTA Button */}
          <Link
            to="/projects"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-semibold text-lg shadow-2xl shadow-indigo-500/50 transition-all hover:scale-105"
          >
            <Plus className="w-6 h-6" />
            Start Creating
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Projects */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Projects</h2>
          <Link to="/projects" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No projects yet</p>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="glass-dark rounded-xl p-4 card-hover"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-white" />
                  </div>
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="font-semibold mb-1">{project.name}</h3>
                <p className="text-xs text-slate-400">
                  Updated {new Date(project.updated_at).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/ai-models" className="glass rounded-2xl p-6 card-hover">
          <Brain className="w-10 h-10 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Configure AI Models</h3>
          <p className="text-sm text-slate-400">Connect GPT-4, Claude, Gemini, and more</p>
        </Link>
        
        <Link to="/projects" className="glass rounded-2xl p-6 card-hover">
          <Code className="w-10 h-10 text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Generate Code</h3>
          <p className="text-sm text-slate-400">AI-powered code generation for Unity</p>
        </Link>
        
        <Link to="/settings" className="glass rounded-2xl p-6 card-hover">
          <Zap className="w-10 h-10 text-yellow-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Unity Integration</h3>
          <p className="text-sm text-slate-400">Connect to Unity 6 via API</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
