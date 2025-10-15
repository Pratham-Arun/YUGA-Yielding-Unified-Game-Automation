import React, { useState } from "react";
import {
  Plus,
  Gamepad2,
  Sword,
  Rocket,
  Puzzle,
  Users,
  Target,
  Car,
  Zap,
  ChevronRight,
  Upload,
  FolderOpen,
  Sparkles,
  Code2,
  Palette,
  Settings,
  Play,
  ArrowLeft,
} from "lucide-react";

export default function NewProject() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  const templates = [
    {
      id: "rpg",
      name: "Medieval RPG",
      description: "Fantasy role-playing game with quests, characters, and combat",
      icon: Sword,
      features: ["Character system", "Inventory", "Quest management", "Combat mechanics"],
      difficulty: "Advanced",
      time: "2-4 weeks",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      id: "shooter",
      name: "Space Shooter",
      description: "Fast-paced arcade shooter with enemies and power-ups",
      icon: Rocket,
      features: ["Player movement", "Shooting mechanics", "Enemy AI", "Power-ups"],
      difficulty: "Intermediate",
      time: "1-2 weeks",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: "puzzle",
      name: "Puzzle Adventure",
      description: "Mind-bending puzzles with exploration elements",
      icon: Puzzle,
      features: ["Puzzle mechanics", "Level progression", "Visual effects", "Sound design"],
      difficulty: "Beginner",
      time: "1 week",
      gradient: "from-green-500 to-teal-600"
    },
    {
      id: "platformer",
      name: "2D Platformer",
      description: "Classic jump-and-run game with collectibles",
      icon: Target,
      features: ["Physics movement", "Collectibles", "Level design", "Animations"],
      difficulty: "Intermediate",
      time: "2-3 weeks",
      gradient: "from-pink-500 to-red-600"
    },
    {
      id: "racing",
      name: "Racing Game",
      description: "High-speed racing with tracks and vehicles",
      icon: Car,
      features: ["Vehicle physics", "Track design", "Lap timing", "AI racers"],
      difficulty: "Advanced",
      time: "3-5 weeks",
      gradient: "from-indigo-500 to-blue-600"
    },
    {
      id: "multiplayer",
      name: "Multiplayer Arena",
      description: "Competitive multiplayer with real-time combat",
      icon: Users,
      features: ["Networking", "Player matching", "Real-time combat", "Leaderboards"],
      difficulty: "Expert",
      time: "4-8 weeks",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const genres = [
    "Action", "Adventure", "RPG", "Strategy", "Puzzle", "Racing", 
    "Shooter", "Platformer", "Simulation", "Sports"
  ];

  const artStyles = [
    "Fantasy", "Sci-Fi", "Realistic", "Cartoon", "Pixel Art", 
    "Low Poly", "Medieval", "Cyberpunk", "Steampunk", "Modern"
  ];

  const handleCreateProject = () => {
    // Simulate project creation
    console.log({
      template: selectedTemplate,
      name: projectName,
      description: projectDescription,
      genre: selectedGenre,
      style: selectedStyle
    });
    
    // Redirect to dashboard or project page
    window.location.href = "/";
  };

  const renderStep1 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Choose a Project Template
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a template to get started quickly, or start from scratch
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate?.id === template.id;
          return (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-6 rounded-xl border transition-all duration-200 text-left ${
                isSelected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.gradient} flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {template.name}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {template.description}
              </p>
              
              <div className="space-y-2 mb-4">
                {template.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    {feature}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-1 rounded-full ${
                  template.difficulty === 'Beginner' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                  template.difficulty === 'Intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                  template.difficulty === 'Advanced' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                }`}>
                  {template.difficulty}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {template.time}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center">
        <button className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
          <FolderOpen size={18} className="mr-2" />
          Start from Scratch
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Project Details
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your {selectedTemplate?.name} project
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter your project name..."
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe your game concept..."
            className="w-full h-24 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Genre
            </label>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select genre...</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Art Style
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select style...</option>
              {artStyles.map((style) => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedTemplate && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedTemplate.gradient} flex items-center justify-center mr-3`}>
                <selectedTemplate.icon size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedTemplate.name} Template
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Includes: {selectedTemplate.features.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          AI Generation Options
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Let AI help you create initial assets and code
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-4">
              <Code2 size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Generate Code
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              AI will create initial scripts for player movement, game mechanics, and core systems.
            </p>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Include starter scripts</span>
            </label>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Palette size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Generate Assets
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Create initial 3D models, textures, and environmental assets based on your theme.
            </p>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Include basic assets</span>
            </label>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Settings size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Project Setup
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Configure Unity project settings, scene layout, and folder structure automatically.
            </p>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-sm">Auto-configure project</span>
            </label>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-8">
          <div className="flex items-center mb-4">
            <Sparkles size={24} className="mr-3" />
            <h3 className="text-xl font-semibold">AI Project Generation</h3>
          </div>
          <p className="mb-4">
            Based on your selections, AI will generate a complete starting project with:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ul className="space-y-1 text-sm">
                <li>• {selectedTemplate?.features[0] || "Core game mechanics"}</li>
                <li>• {selectedTemplate?.features[1] || "Player systems"}</li>
                <li>• Basic UI and menus</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1 text-sm">
                <li>• {selectedStyle} art style assets</li>
                <li>• Scene layouts and lighting</li>
                <li>• Audio placeholders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button 
                onClick={() => window.history.back()}
                className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                  <Plus size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Create New Project
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Start building your game with AI assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step > stepNumber ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
                step === 1
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              <ArrowLeft size={18} className="mr-2" />
              Previous
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedTemplate}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={18} className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleCreateProject}
                disabled={!projectName.trim()}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                <Play size={20} className="mr-2" />
                Create Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}