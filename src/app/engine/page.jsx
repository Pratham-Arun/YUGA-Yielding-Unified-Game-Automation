import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Save,
  FolderOpen,
  Settings,
  Monitor,
  Layers,
  Package,
  FileText,
  Image,
  Volume2,
  Gamepad2,
  Code2,
  Eye,
  Grid3X3,
  Move3D,
  RotateCw,
  Scale,
  Sun,
  Camera,
  Box,
  Circle,
  Cylinder,
  Triangle,
  Zap,
  Brush,
  Mountain,
  Users,
  Wifi,
  Download,
  Upload,
  Bug,
  Activity,
  Terminal,
  Maximize,
  Minimize,
  X,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  MoreHorizontal,
} from "lucide-react";

export default function GameEngine() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePanel, setActivePanel] = useState("scene");
  const [selectedTool, setSelectedTool] = useState("select");
  const [selectedObject, setSelectedObject] = useState(null);
  const [showConsole, setShowConsole] = useState(false);
  const [hierarchyExpanded, setHierarchyExpanded] = useState({});
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(350);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);

  const sceneObjects = [
    {
      id: 1,
      name: "Main Camera",
      type: "Camera",
      icon: Camera,
      children: []
    },
    {
      id: 2,
      name: "Directional Light",
      type: "Light",
      icon: Sun,
      children: []
    },
    {
      id: 3,
      name: "Player",
      type: "GameObject",
      icon: Box,
      children: [
        { id: 4, name: "Mesh Renderer", type: "Component", icon: Box },
        { id: 5, name: "Rigidbody", type: "Component", icon: Box },
        { id: 6, name: "Player Controller", type: "Script", icon: Code2 }
      ]
    },
    {
      id: 7,
      name: "Environment",
      type: "GameObject",
      icon: Mountain,
      children: [
        { id: 8, name: "Ground", type: "GameObject", icon: Grid3X3 },
        { id: 9, name: "Trees", type: "GameObject", icon: Mountain }
      ]
    }
  ];

  const tools = [
    { id: "select", icon: Move3D, name: "Select", shortcut: "Q" },
    { id: "move", icon: Move3D, name: "Move", shortcut: "W" },
    { id: "rotate", icon: RotateCw, name: "Rotate", shortcut: "E" },
    { id: "scale", icon: Scale, name: "Scale", shortcut: "R" },
  ];

  const primitives = [
    { id: "cube", icon: Box, name: "Cube" },
    { id: "sphere", icon: Circle, name: "Sphere" },
    { id: "cylinder", icon: Cylinder, name: "Cylinder" },
    { id: "pyramid", icon: Triangle, name: "Pyramid" },
  ];

  const panels = [
    { id: "scene", name: "Scene", icon: Monitor },
    { id: "hierarchy", name: "Hierarchy", icon: Layers },
    { id: "inspector", name: "Inspector", icon: Settings },
    { id: "project", name: "Project", icon: FolderOpen },
    { id: "console", name: "Console", icon: Terminal },
    { id: "animator", name: "Animator", icon: Play },
    { id: "profiler", name: "Profiler", icon: Activity },
  ];

  const consoleMessages = [
    { type: "info", message: "Game engine initialized successfully", timestamp: "10:23:45" },
    { type: "warning", message: "Texture quality reduced for performance", timestamp: "10:24:12" },
    { type: "error", message: "Script compilation failed: PlayerController.cs", timestamp: "10:24:30" },
    { type: "info", message: "Asset imported: sword_model.fbx", timestamp: "10:24:45" },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsPaused(false);
  };

  const toggleHierarchyItem = (id) => {
    setHierarchyExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderHierarchyItem = (item, level = 0) => {
    const Icon = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = hierarchyExpanded[item.id];

    return (
      <div key={item.id}>
        <div 
          className={`flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
            selectedObject?.id === item.id ? 'bg-blue-100 dark:bg-blue-900/30' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedObject(item)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleHierarchyItem(item.id);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronRight size={12} />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}
          <Icon size={14} className="mr-2 text-gray-600 dark:text-gray-400" />
          <span className="text-sm">{item.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {item.children.map(child => renderHierarchyItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderScenePanel = () => (
    <div className="h-full bg-gray-900 relative overflow-hidden">
      {/* Scene View Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="bg-black bg-opacity-50 rounded-lg p-2 flex gap-1">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                className={`p-2 rounded transition-colors ${
                  selectedTool === tool.id 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                title={`${tool.name} (${tool.shortcut})`}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Primitives Panel */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-black bg-opacity-50 rounded-lg p-2">
          <div className="text-xs text-gray-300 mb-2">Add Primitive</div>
          <div className="grid grid-cols-2 gap-1">
            {primitives.map(primitive => {
              const Icon = primitive.icon;
              return (
                <button
                  key={primitive.id}
                  className="p-2 text-gray-300 hover:bg-gray-700 rounded transition-colors"
                  title={primitive.name}
                >
                  <Icon size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scene View */}
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-gray-400 text-center">
          <Grid3X3 size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">3D Scene View</p>
          <p className="text-sm opacity-75">Select objects to edit properties</p>
        </div>
      </div>

      {/* Scene Stats */}
      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 rounded-lg p-2 text-xs text-gray-300">
        <div>Objects: 4</div>
        <div>Triangles: 1,204</div>
        <div>FPS: 60</div>
      </div>
    </div>
  );

  const renderHierarchyPanel = () => (
    <div className="h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Hierarchy</h3>
          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <MoreHorizontal size={14} />
          </button>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sceneObjects.map(item => renderHierarchyItem(item))}
      </div>
    </div>
  );

  const renderInspectorPanel = () => (
    <div className="h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium">Inspector</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {selectedObject ? (
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <selectedObject.icon size={16} className="mr-2" />
                <input 
                  type="text" 
                  value={selectedObject.name}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                />
              </div>
              <div className="text-xs text-gray-500">Tag: Untagged | Layer: Default</div>
            </div>

            {/* Transform Component */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Transform</span>
                <button className="text-xs text-blue-600 hover:text-blue-700">Reset</button>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Position</label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <input type="number" defaultValue="0" className="px-2 py-1 text-xs border rounded" />
                    <input type="number" defaultValue="0" className="px-2 py-1 text-xs border rounded" />
                    <input type="number" defaultValue="0" className="px-2 py-1 text-xs border rounded" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Rotation</label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <input type="number" defaultValue="0" className="px-2 py-1 text-xs border rounded" />
                    <input type="number" defaultValue="0" className="px-2 py-1 text-xs border rounded" />
                    <input type="number" defaultValue="0" className="px-2 py-1 text-xs border rounded" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600 dark:text-gray-400">Scale</label>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <input type="number" defaultValue="1" className="px-2 py-1 text-xs border rounded" />
                    <input type="number" defaultValue="1" className="px-2 py-1 text-xs border rounded" />
                    <input type="number" defaultValue="1" className="px-2 py-1 text-xs border rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Add Component Button */}
            <button className="w-full py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Add Component
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-8">
            <Settings size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select an object to view properties</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProjectPanel = () => (
    <div className="h-full">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Project</h3>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Filter size={14} />
            </button>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 p-3">
        <div className="grid grid-cols-3 gap-2">
          {/* Asset folders */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <FolderOpen size={24} className="mb-1 text-yellow-600" />
            <span className="text-xs">Scripts</span>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <FolderOpen size={24} className="mb-1 text-yellow-600" />
            <span className="text-xs">Models</span>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <FolderOpen size={24} className="mb-1 text-yellow-600" />
            <span className="text-xs">Textures</span>
          </div>
          {/* Asset files */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <Code2 size={20} className="mb-1 text-blue-600" />
            <span className="text-xs">Player.cs</span>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <Image size={20} className="mb-1 text-green-600" />
            <span className="text-xs">sword.png</span>
          </div>
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
            <Box size={20} className="mb-1 text-purple-600" />
            <span className="text-xs">house.fbx</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConsolePanel = () => (
    <div className="h-full bg-gray-900 text-gray-100">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex gap-2">
          <button className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded">All</button>
          <button className="px-2 py-1 text-xs hover:bg-gray-700 rounded">Info</button>
          <button className="px-2 py-1 text-xs hover:bg-gray-700 rounded">Warning</button>
          <button className="px-2 py-1 text-xs hover:bg-gray-700 rounded">Error</button>
        </div>
        <button className="px-2 py-1 text-xs hover:bg-gray-700 rounded">Clear</button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
        {consoleMessages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2 py-1 ${
            msg.type === 'error' ? 'text-red-400' : 
            msg.type === 'warning' ? 'text-yellow-400' : 'text-gray-300'
          }`}>
            <span className="text-gray-500 text-xs">{msg.timestamp}</span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivePanel = () => {
    switch (activePanel) {
      case "scene": return renderScenePanel();
      case "hierarchy": return renderHierarchyPanel();
      case "inspector": return renderInspectorPanel();
      case "project": return renderProjectPanel();
      case "console": return renderConsolePanel();
      default: return renderScenePanel();
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Top Menu Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 size={20} className="text-blue-600" />
              <span className="font-bold text-gray-900 dark:text-white">GameForge Engine</span>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">File</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Edit</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Assets</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">GameObject</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Component</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Window</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Help</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Save size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Users size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Wifi size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Play Controls */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-center gap-2">
          <button 
            onClick={handlePlay}
            disabled={isPlaying && !isPaused}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
          >
            <Play size={16} className={isPlaying && !isPaused ? "text-blue-600" : ""} />
          </button>
          <button 
            onClick={handlePause}
            disabled={!isPlaying}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
          >
            <Pause size={16} className={isPaused ? "text-yellow-600" : ""} />
          </button>
          <button 
            onClick={handleStop}
            disabled={!isPlaying}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50"
          >
            <Square size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isPlaying ? (isPaused ? "Paused" : "Playing") : "Stopped"}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Panel */}
        <div 
          className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          style={{ width: leftPanelWidth }}
        >
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {["hierarchy", "project"].map(panel => (
              <button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`flex-1 px-3 py-2 text-sm border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
                  activePanel === panel 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {panel.charAt(0).toUpperCase() + panel.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1">
            {(activePanel === "hierarchy" || activePanel === "project") && renderActivePanel()}
          </div>
        </div>

        {/* Center Panel - Scene View */}
        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActivePanel("scene")}
              className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              Scene
            </button>
            <button className="px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Game
            </button>
            <button className="px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Asset Store
            </button>
          </div>
          <div className="flex-1">
            {renderScenePanel()}
          </div>
        </div>

        {/* Right Panel */}
        <div 
          className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
          style={{ width: rightPanelWidth }}
        >
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActivePanel("inspector")}
              className="flex-1 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              Inspector
            </button>
          </div>
          <div className="h-full">
            {renderInspectorPanel()}
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      {showConsole && (
        <div 
          className="border-t border-gray-200 dark:border-gray-700"
          style={{ height: bottomPanelHeight }}
        >
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActivePanel("console")}
              className="px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              Console
            </button>
            <button className="px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">
              Profiler
            </button>
            <div className="ml-auto p-2">
              <button 
                onClick={() => setShowConsole(false)}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
          {renderConsolePanel()}
        </div>
      )}

      {/* Bottom Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Ready</span>
          <button 
            onClick={() => setShowConsole(!showConsole)}
            className="hover:text-gray-900 dark:hover:text-gray-200"
          >
            Console {consoleMessages.filter(m => m.type === 'error').length > 0 && 
              <span className="text-red-500">({consoleMessages.filter(m => m.type === 'error').length})</span>
            }
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span>Memory: 245 MB</span>
          <span>Build: WebGL</span>
          <span>v2025.1.0</span>
        </div>
      </div>
    </div>
  );
}