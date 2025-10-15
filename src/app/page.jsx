import React, { useState } from "react";
import {
  Code2,
  Palette,
  Play,
  Folder,
  MessageSquare,
  Settings,
  HelpCircle,
  Crown,
  Plus,
  Search,
  Upload,
  Download,
  Zap,
  Cpu,
  Image,
  Box,
  Users,
  Clock,
  Menu,
  X,
  ChevronRight,
  Star,
  Gamepad2,
  Wand2,
  Bug,
  Lightbulb,
  FileCode,
  Layers,
} from "lucide-react";

export default function GameDevPlatform() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const navItems = [
    { icon: Folder, label: "Dashboard", id: "dashboard", href: "/" },
    {
      icon: Code2,
      label: "AI Code Assistant",
      id: "code",
      href: "/ai-code-assistant",
    },
    {
      icon: Palette,
      label: "Asset Generator",
      id: "assets",
      href: "/asset-generator",
    },
    { icon: Play, label: "Game Engine", id: "engine", href: "/engine" },
    {
      icon: Users,
      label: "Collaboration",
      id: "collaboration",
      href: "/collaboration",
    },
  ];

  const handleNavigation = (item) => {
    setActiveNav(item.label);
    setSidebarOpen(false);
    if (item.href && item.href !== "/") {
      window.location.href = item.href;
    }
  };

  const handleNewProject = () => {
    window.location.href = "/new-project";
  };

  const handleTryAI = () => {
    window.location.href = "/ai-code-assistant";
  };

  const handleGenerateAssets = () => {
    window.location.href = "/asset-generator";
  };

  const handleLivePreview = () => {
    window.location.href = "/engine";
  };

  const handleScriptEditor = () => {
    window.location.href = "/script-editor";
  };

  const handleAnimationEditor = () => {
    window.location.href = "/animation-editor";
  };

  const handleVisualScripting = () => {
    window.location.href = "/visual-scripting";
  };

  const recentProjects = [
    {
      id: 1,
      name: "Medieval Quest RPG",
      lastModified: "2 hours ago",
      progress: 75,
      type: "RPG",
      thumbnail:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Space Shooter Alpha",
      lastModified: "1 day ago",
      progress: 45,
      type: "Arcade",
      thumbnail:
        "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Puzzle Adventure",
      lastModified: "3 days ago",
      progress: 60,
      type: "Puzzle",
      thumbnail:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop",
    },
  ];

  const aiFeatures = [
    {
      icon: Wand2,
      title: "AI-Assisted Game Generation",
      description:
        "Generate complete game worlds, levels, and environments using simple text prompts. Auto-place objects, terrain, lighting, and textures with style preferences.",
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: FileCode,
      title: "AI Code Generation",
      description:
        "AI writes C# scripts inside Unity based on your instructions. Live debug suggestions and code optimization with OpenAI integration.",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: Users,
      title: "AI Character & Environment Design",
      description:
        "Generate 3D characters, NPCs, and creatures with dynamic dialogue, personality traits, and behavior trees automatically.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Layers,
      title: "Procedural World Generation",
      description:
        "Create biomes, villages, and dungeons using procedural algorithms. Supports custom seeds and theme-based generation.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: MessageSquare,
      title: "Interactive AI Blacksmith",
      description:
        "Your creative AI companion talks to you, builds and modifies objects in real-time using natural dialogue with voice support.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: Zap,
      title: "Prompt-to-Prototype System",
      description:
        "Convert simple prompts into playable prototypes automatically. From idea to interactive game in minutes.",
      gradient: "from-pink-500 to-red-500",
    },
    {
      icon: Box,
      title: "Dynamic Asset Forge",
      description:
        "Generate and customize assets on-the-fly with the Asset Smithy system. Combine models with AI textures and procedural geometry.",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      icon: Lightbulb,
      title: "Learning & Collaboration",
      description:
        "Built-in tutorial assistant for Unity beginners with collaborative forging sessions and interactive AI mentoring.",
      gradient: "from-emerald-500 to-green-500",
    },
  ];

  const supportedLanguages = [
    { name: "C++", color: "bg-blue-500" },
    { name: "C#", color: "bg-purple-500" },
    { name: "Python", color: "bg-green-500" },
    { name: "Java", color: "bg-orange-500" },
  ];

  const stats = [
    { label: "Projects Created", value: "1,240", icon: Folder },
    { label: "Assets Generated", value: "45,820", icon: Image },
    { label: "Bugs Fixed", value: "8,930", icon: Bug },
    { label: "Hours Saved", value: "12,450", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] font-inter">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 z-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-900 dark:text-white" />
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Gamepad2 size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                YUGA
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-1">
                AI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-[#121212] border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>

          {/* Brand */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Gamepad2 size={24} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                YUGA
              </span>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-1">
                AI
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  <span className="text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="space-y-2 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button className="w-full flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <HelpCircle size={18} className="mr-3" />
              <span className="text-sm">Help & Support</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Settings size={18} className="mr-3" />
              <span className="text-sm">Settings</span>
            </button>
            <button className="w-full flex items-center px-4 py-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors">
              <Crown size={18} className="mr-3" />
              <span className="text-sm">Upgrade to Pro</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center pt-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                PA
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  Pratham Arun
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  prathamarun7@gmail.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, John! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Let's build something amazing with AI-powered game development
              </p>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <button className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center">
                <Upload size={18} className="mr-2" />
                Import Project
              </button>
              <button
                onClick={handleNewProject}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center shadow-lg"
              >
                <Plus size={18} className="mr-2" />
                New Project
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon
                      size={24}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Features
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mr-4 flex-shrink-0`}
                      >
                        <Icon size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                      <ChevronRight
                        size={20}
                        className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Supported Languages */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Your Language
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Work with your preferred programming language. Our AI
                understands the syntax and best practices for each:
              </p>
              <div className="flex flex-wrap gap-3">
                {supportedLanguages.map((language, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${language.color} mr-3`}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {language.name}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ✨ AI automatically detects your language preference and
                  adapts suggestions accordingly
                </p>
              </div>
            </div>
          </div>

          {/* Cross-Integration & Advanced Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Unity Integration & Advanced Features
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Unity Integration */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Box size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Unity 6 (2025) Compatible
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Seamlessly integrates with Unity's latest features and AI APIs
                  including OpenAI GPT, Stability AI, and Mixamo for complete
                  game development workflow.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    OpenAI GPT
                  </span>
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                    Stability AI
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                    Mixamo
                  </span>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full">
                    Ready Player Me
                  </span>
                </div>
              </div>

              {/* Voice Commands */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center mr-3">
                    <MessageSquare size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Voice Command Building
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Simply say "Forge me a sword" and watch as 3D models are
                  created in real-time. Speech-to-Text and Text-to-Speech
                  integration for natural workflow.
                </p>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Voice-enabled AI Assistant
                </div>
              </div>

              {/* AI Playtesting */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-pink-600 to-red-600 rounded-lg flex items-center justify-center mr-3">
                    <Play size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Playtesting & Optimization
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  AI bots play your levels and provide detailed feedback.
                  Real-time asset optimization reduces poly count without losing
                  visual quality.
                </p>
                <div className="flex items-center text-sm text-pink-600 dark:text-pink-400">
                  <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                  Automated QA Testing
                </div>
              </div>

              {/* Future VR/AR */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <Cpu size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    VR/AR Ready
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Extensible to VR/AR game creation with emotion-based
                  environment reactions and immersive building experiences
                  coming soon.
                </p>
                <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                  Coming Soon
                </div>
              </div>
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setActiveProject(project)}
                  className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg dark:hover:bg-gray-750 transition-all duration-200 cursor-pointer group"
                >
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs font-medium">
                        {project.type}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Last modified {project.lastModified}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-xl font-bold mb-2">
                  Ready to start creating?
                </h3>
                <p className="text-blue-100">
                  Use our AI assistant to generate code, assets, or entire game
                  scenes instantly.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleTryAI}
                  className="px-6 py-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all duration-200 flex items-center"
                >
                  <Zap size={18} className="mr-2" />
                  Try AI Assistant
                </button>
                <button
                  onClick={handleGenerateAssets}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center font-semibold"
                >
                  <Wand2 size={18} className="mr-2" />
                  Generate Assets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}