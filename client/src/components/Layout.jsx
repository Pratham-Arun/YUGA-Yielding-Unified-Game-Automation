import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Brain, 
  Settings, 
  Menu,
  Sparkles,
  Zap,
  Box,
  Film,
  Workflow,
  Wand2,
  Globe
} from 'lucide-react';
import useStore from '../store/useStore';

const Layout = ({ children }) => {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useStore();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/game-engine', icon: Box, label: 'Game Engine' },
    { path: '/animation-editor', icon: Film, label: 'Animation' },
    { path: '/visual-scripting', icon: Workflow, label: 'Visual Script' },
    { path: '/asset-generator', icon: Wand2, label: 'Asset Gen' },
    { path: '/world-builder', icon: Globe, label: 'World Builder' },
    { path: '/ai-models', icon: Brain, label: 'AI Models' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`glass-dark border-r border-white/10 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {sidebarOpen ? (
                <div>
                  <h1 className="text-2xl font-bold gradient-text">YUGA</h1>
                  <p className="text-xs text-slate-400">AI Game Engine</p>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">Y</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-l-4 border-indigo-500'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {sidebarOpen && (
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-400" />
              {sidebarOpen && <span className="text-sm text-slate-400">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
