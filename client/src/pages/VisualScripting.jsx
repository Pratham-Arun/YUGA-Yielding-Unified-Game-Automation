/**
 * YUGA Engine - Visual Scripting Component
 * 
 * This file contains node-based visual scripting concepts inspired by Godot Engine
 * Copyright (c) 2014-present Godot Engine contributors
 * Copyright (c) 2007-2014 Juan Linietsky, Ariel Manzur
 * Licensed under MIT License - See GODOT_LICENSE.txt
 * 
 * Node system and visual scripting patterns are based on Godot's VisualScript
 * with modifications for YUGA Engine's web-based implementation.
 */

import React, { useState, useCallback, useRef } from 'react';
import { Plus, Play, Save, Trash2, Link2 } from 'lucide-react';

export default function VisualScripting() {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'event', label: 'On Start', x: 100, y: 100 },
    { id: 2, type: 'action', label: 'Move Forward', x: 300, y: 100 },
    { id: 3, type: 'logic', label: 'If Condition', x: 500, y: 100 },
  ]);

  const [connections, setConnections] = useState([
    { from: 1, to: 2 },
    { from: 2, to: 3 },
  ]);

  const [draggingNode, setDraggingNode] = useState(null);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const nodeTypes = [
    { type: 'event', label: 'Event', color: 'bg-green-600' },
    { type: 'action', label: 'Action', color: 'bg-blue-600' },
    { type: 'logic', label: 'Logic', color: 'bg-purple-600' },
    { type: 'math', label: 'Math', color: 'bg-orange-600' },
    { type: 'variable', label: 'Variable', color: 'bg-yellow-600' },
  ];

  const addNode = (type) => {
    const newNode = {
      id: Date.now(),
      type,
      label: `New ${type}`,
      x: 200 + Math.random() * 200,
      y: 200 + Math.random() * 200,
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    setDraggingNode(node.id);
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggingNode) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      setNodes(nodes.map(n => 
        n.id === draggingNode 
          ? { ...n, x: Math.max(0, newX), y: Math.max(0, newY) }
          : n
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleConnectStart = (e, nodeId) => {
    e.stopPropagation();
    setConnectingFrom(nodeId);
  };

  const handleConnectEnd = (e, nodeId) => {
    e.stopPropagation();
    if (connectingFrom && connectingFrom !== nodeId) {
      setConnections([...connections, { from: connectingFrom, to: nodeId }]);
    }
    setConnectingFrom(null);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
  };

  return (
    <div className="flex h-screen">
      {/* Node Library */}
      <div className="w-64 glass-dark border-r border-white/10 p-4">
        <h2 className="text-lg font-bold mb-4">Node Library</h2>
        <div className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => addNode(nodeType.type)}
              className={`w-full p-3 ${nodeType.color} hover:opacity-80 rounded-lg text-left transition-opacity`}
            >
              <div className="font-medium">{nodeType.label}</div>
              <div className="text-xs opacity-75">Click to add</div>
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="glass-dark border-b border-white/10 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm transition-colors">
              <Play className="w-4 h-4" />
              Execute
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm transition-colors">
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
          <div className="text-sm text-slate-400">
            Nodes: {nodes.length} | Connections: {connections.length}
          </div>
        </div>

        {/* Node Canvas */}
        <div 
          ref={canvasRef}
          className="flex-1 bg-slate-900 relative overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none">
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={idx}
                  x1={fromNode.x + 100}
                  y1={fromNode.y + 25}
                  x2={toNode.x}
                  y2={toNode.y + 25}
                  stroke="rgba(99, 102, 241, 0.5)"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const nodeType = nodeTypes.find(nt => nt.type === node.type);
            return (
              <div
                key={node.id}
                className={`absolute ${nodeType?.color} rounded-lg p-3 shadow-lg cursor-move w-48 ${
                  draggingNode === node.id ? 'opacity-70' : ''
                }`}
                style={{ left: node.x, top: node.y }}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{node.label}</span>
                  <button 
                    className="p-1 hover:bg-white/10 rounded"
                    onClick={() => deleteNode(node.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  {/* Input Connection Point */}
                  <button
                    className={`w-4 h-4 bg-white rounded-full hover:scale-125 transition-transform ${
                      connectingFrom ? 'ring-2 ring-yellow-400' : ''
                    }`}
                    onClick={(e) => handleConnectEnd(e, node.id)}
                    title="Input"
                  />
                  {/* Output Connection Point */}
                  <button
                    className={`w-4 h-4 bg-white rounded-full hover:scale-125 transition-transform flex items-center justify-center ${
                      connectingFrom === node.id ? 'ring-2 ring-green-400' : ''
                    }`}
                    onClick={(e) => handleConnectStart(e, node.id)}
                    title="Output - Click to connect"
                  >
                    {connectingFrom === node.id && <Link2 className="w-3 h-3 text-green-600" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Properties Panel */}
      <div className="w-80 glass-dark border-l border-white/10 p-4">
        <h2 className="text-lg font-bold mb-4">Node Properties</h2>
        <p className="text-sm text-slate-400">Select a node to edit properties</p>
      </div>
    </div>
  );
}
