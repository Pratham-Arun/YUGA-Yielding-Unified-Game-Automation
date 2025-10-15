import React, { useState, useRef } from "react";
import {
  GitBranch,
  Play,
  Save,
  Search,
  Plus,
  Minus,
  Copy,
  Trash2,
  Settings,
  Zap,
  Target,
  Clock,
  MousePointer,
  Keyboard,
  Camera,
  Volume2,
  Gamepad2,
  Code2,
  Database,
  FileText,
  MoreHorizontal,
  X,
  ChevronDown,
  ChevronRight,
  Box,
} from "lucide-react";

export default function VisualScripting() {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);

  const nodeTypes = [
    {
      category: "Events",
      nodes: [
        { name: "On Start", type: "event", color: "bg-green-500", icon: Play },
        { name: "On Update", type: "event", color: "bg-green-500", icon: Clock },
        { name: "On Click", type: "event", color: "bg-green-500", icon: MousePointer },
        { name: "On Key Press", type: "event", color: "bg-green-500", icon: Keyboard },
        { name: "On Collision", type: "event", color: "bg-green-500", icon: Target },
      ]
    },
    {
      category: "Actions",
      nodes: [
        { name: "Move Object", type: "action", color: "bg-blue-500", icon: Box },
        { name: "Play Sound", type: "action", color: "bg-blue-500", icon: Volume2 },
        { name: "Change Camera", type: "action", color: "bg-blue-500", icon: Camera },
        { name: "Destroy Object", type: "action", color: "bg-blue-500", icon: Trash2 },
        { name: "Print Debug", type: "action", color: "bg-blue-500", icon: FileText },
      ]
    },
    {
      category: "Logic",
      nodes: [
        { name: "If Statement", type: "logic", color: "bg-purple-500", icon: GitBranch },
        { name: "Compare", type: "logic", color: "bg-purple-500", icon: Target },
        { name: "AND Gate", type: "logic", color: "bg-purple-500", icon: Zap },
        { name: "OR Gate", type: "logic", color: "bg-purple-500", icon: Zap },
        { name: "NOT Gate", type: "logic", color: "bg-purple-500", icon: Zap },
      ]
    },
    {
      category: "Math",
      nodes: [
        { name: "Add", type: "math", color: "bg-orange-500", icon: Plus },
        { name: "Subtract", type: "math", color: "bg-orange-500", icon: Minus },
        { name: "Multiply", type: "math", color: "bg-orange-500", icon: X },
        { name: "Divide", type: "math", color: "bg-orange-500", icon: MoreHorizontal },
        { name: "Random", type: "math", color: "bg-orange-500", icon: Zap },
      ]
    },
    {
      category: "Variables",
      nodes: [
        { name: "Get Variable", type: "variable", color: "bg-yellow-500", icon: Database },
        { name: "Set Variable", type: "variable", color: "bg-yellow-500", icon: Database },
        { name: "Integer", type: "variable", color: "bg-yellow-500", icon: FileText },
        { name: "Float", type: "variable", color: "bg-yellow-500", icon: FileText },
        { name: "String", type: "variable", color: "bg-yellow-500", icon: FileText },
      ]
    }
  ];

  const [nodes, setNodes] = useState([
    {
      id: 1,
      type: "event",
      name: "On Start",
      position: { x: 100, y: 100 },
      inputs: [],
      outputs: [{ id: "out1", name: "Execute", type: "exec" }],
      color: "bg-green-500"
    },
    {
      id: 2,
      type: "action",
      name: "Move Object",
      position: { x: 400, y: 100 },
      inputs: [
        { id: "in1", name: "Execute", type: "exec" },
        { id: "in2", name: "Target", type: "object" },
        { id: "in3", name: "Position", type: "vector3" }
      ],
      outputs: [{ id: "out1", name: "Complete", type: "exec" }],
      color: "bg-blue-500"
    },
    {
      id: 3,
      type: "variable",
      name: "Vector3",
      position: { x: 150, y: 250 },
      inputs: [
        { id: "in1", name: "X", type: "float" },
        { id: "in2", name: "Y", type: "float" },
        { id: "in3", name: "Z", type: "float" }
      ],
      outputs: [{ id: "out1", name: "Vector", type: "vector3" }],
      color: "bg-yellow-500"
    }
  ]);

  const [connections, setConnections] = useState([
    { from: { nodeId: 1, outputId: "out1" }, to: { nodeId: 2, inputId: "in1" } },
    { from: { nodeId: 3, outputId: "out1" }, to: { nodeId: 2, inputId: "in3" } }
  ]);

  const [expandedCategories, setExpandedCategories] = useState({
    Events: true,
    Actions: true,
    Logic: false,
    Math: false,
    Variables: false
  });

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleAddNode = (nodeType) => {
    const newNode = {
      id: Date.now(),
      type: nodeType.type,
      name: nodeType.name,
      position: { x: 200, y: 200 },
      inputs: getDefaultInputs(nodeType),
      outputs: getDefaultOutputs(nodeType),
      color: nodeType.color
    };
    setNodes([...nodes, newNode]);
  };

  const getDefaultInputs = (nodeType) => {
    switch (nodeType.name) {
      case "Move Object":
        return [
          { id: "in1", name: "Execute", type: "exec" },
          { id: "in2", name: "Target", type: "object" },
          { id: "in3", name: "Position", type: "vector3" }
        ];
      case "If Statement":
        return [
          { id: "in1", name: "Execute", type: "exec" },
          { id: "in2", name: "Condition", type: "bool" }
        ];
      case "Add":
        return [
          { id: "in1", name: "A", type: "float" },
          { id: "in2", name: "B", type: "float" }
        ];
      default:
        return nodeType.type === "event" ? [] : [{ id: "in1", name: "Execute", type: "exec" }];
    }
  };

  const getDefaultOutputs = (nodeType) => {
    switch (nodeType.name) {
      case "If Statement":
        return [
          { id: "out1", name: "True", type: "exec" },
          { id: "out2", name: "False", type: "exec" }
        ];
      case "Add":
        return [{ id: "out1", name: "Result", type: "float" }];
      default:
        return [{ id: "out1", name: nodeType.type === "event" ? "Execute" : "Complete", type: "exec" }];
    }
  };

  const renderNode = (node) => {
    const isSelected = selectedNode?.id === node.id;
    
    return (
      <div
        key={node.id}
        className={`absolute bg-white dark:bg-gray-800 border-2 rounded-lg shadow-lg cursor-move min-w-48 ${
          isSelected ? 'border-blue-500' : 'border-gray-300 dark:border-gray-600'
        }`}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${zoom})`
        }}
        onClick={() => handleNodeClick(node)}
      >
        {/* Node Header */}
        <div className={`${node.color} text-white px-3 py-2 rounded-t-md flex items-center justify-between`}>
          <span className="text-sm font-medium">{node.name}</span>
          <button className="hover:bg-black hover:bg-opacity-20 rounded p-1">
            <X size={12} />
          </button>
        </div>

        {/* Node Body */}
        <div className="p-3">
          {/* Input Ports */}
          {node.inputs.length > 0 && (
            <div className="space-y-2 mb-3">
              {node.inputs.map((input) => (
                <div key={input.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full border-2 mr-2 ${
                    input.type === 'exec' ? 'bg-white border-gray-800' :
                    input.type === 'object' ? 'bg-blue-500 border-blue-600' :
                    input.type === 'vector3' ? 'bg-purple-500 border-purple-600' :
                    input.type === 'float' ? 'bg-green-500 border-green-600' :
                    'bg-gray-500 border-gray-600'
                  }`} />
                  <span className="text-xs text-gray-700 dark:text-gray-300">{input.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Output Ports */}
          {node.outputs.length > 0 && (
            <div className="space-y-2">
              {node.outputs.map((output) => (
                <div key={output.id} className="flex items-center justify-end">
                  <span className="text-xs text-gray-700 dark:text-gray-300 mr-2">{output.name}</span>
                  <div className={`w-3 h-3 rounded-full border-2 ${
                    output.type === 'exec' ? 'bg-white border-gray-800' :
                    output.type === 'object' ? 'bg-blue-500 border-blue-600' :
                    output.type === 'vector3' ? 'bg-purple-500 border-purple-600' :
                    output.type === 'float' ? 'bg-green-500 border-green-600' :
                    'bg-gray-500 border-gray-600'
                  }`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderConnections = () => {
    return connections.map((connection, index) => {
      const fromNode = nodes.find(n => n.id === connection.from.nodeId);
      const toNode = nodes.find(n => n.id === connection.to.nodeId);
      
      if (!fromNode || !toNode) return null;

      const fromX = fromNode.position.x + 192; // Node width
      const fromY = fromNode.position.y + 40; // Approximate output position
      const toX = toNode.position.x;
      const toY = toNode.position.y + 40; // Approximate input position

      return (
        <svg
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6B7280"
              />
            </marker>
          </defs>
          <path
            d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
            stroke="#6B7280"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      );
    });
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitBranch size={20} className="text-blue-600" />
              <span className="font-bold text-gray-900 dark:text-white">Visual Scripting</span>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">File</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Edit</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">View</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Tools</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Save Script">
              <Save size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Test Script">
              <Play size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Settings">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Node Library */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Node Library</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search nodes..."
                className="w-full pl-10 pr-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {nodeTypes.map((category) => (
              <div key={category.category} className="mb-4">
                <button 
                  onClick={() => setExpandedCategories(prev => ({
                    ...prev,
                    [category.category]: !prev[category.category]
                  }))}
                  className="flex items-center w-full text-left mb-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {expandedCategories[category.category] ? (
                    <ChevronDown size={14} className="mr-2" />
                  ) : (
                    <ChevronRight size={14} className="mr-2" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">{category.category}</span>
                </button>
                
                {expandedCategories[category.category] && (
                  <div className="space-y-1 ml-4">
                    {category.nodes.map((node) => {
                      const Icon = node.icon;
                      return (
                        <button
                          key={node.name}
                          onClick={() => handleAddNode(node)}
                          className="w-full flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          <div className={`w-4 h-4 rounded mr-3 flex items-center justify-center ${node.color}`}>
                            <Icon size={10} className="text-white" />
                          </div>
                          {node.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
          {/* Canvas Controls */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex items-center gap-2">
              <button 
                onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Grid Background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
              backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`
            }}
          />

          {/* Canvas Content */}
          <div 
            ref={canvasRef}
            className="absolute inset-0 overflow-hidden"
            style={{ transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }}
          >
            {renderConnections()}
            {nodes.map(renderNode)}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Properties</h3>
          </div>
          
          {selectedNode ? (
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Node Name
                  </label>
                  <input 
                    type="text" 
                    value={selectedNode.name}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Node Type
                  </label>
                  <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {selectedNode.type}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Position
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      value={selectedNode.position.x}
                      placeholder="X"
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                    />
                    <input 
                      type="number" 
                      value={selectedNode.position.y}
                      placeholder="Y"
                      className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                    />
                  </div>
                </div>

                {selectedNode.inputs.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Input Parameters
                    </label>
                    <div className="space-y-2">
                      {selectedNode.inputs.map((input) => (
                        <div key={input.id} className="border border-gray-200 dark:border-gray-600 rounded p-2">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            {input.name} ({input.type})
                          </div>
                          {input.type === 'float' && (
                            <input 
                              type="number" 
                              placeholder="Value"
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                            />
                          )}
                          {input.type === 'string' && (
                            <input 
                              type="text" 
                              placeholder="Text"
                              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                            />
                          )}
                          {input.type === 'bool' && (
                            <input 
                              type="checkbox"
                              className="w-4 h-4"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center">
                    <Trash2 size={14} className="mr-2" />
                    Delete Node
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <GitBranch size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a node to view properties</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Nodes: {nodes.length}</span>
          <span>Connections: {connections.length}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Script: PlayerController_Visual</span>
          <span>Auto-save: Enabled</span>
        </div>
      </div>
    </div>
  );
}