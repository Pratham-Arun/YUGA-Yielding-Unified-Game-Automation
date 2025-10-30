import React, { useState } from "react";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  Save,
  Plus,
  Minus,
  Copy,
  Trash2,
  Settings,
  Search,
  Filter,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Move,
  RotateCw,
  Scale,
  Zap,
  Clock,
  Target,
  Layers,
  Box,
  User,
} from "lucide-react";

export default function AnimationEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(30);
  const [totalFrames, setTotalFrames] = useState(120);
  const [fps, setFps] = useState(60);
  const [selectedLayer, setSelectedLayer] = useState(0);
  const [selectedKeyframe, setSelectedKeyframe] = useState(null);
  const [timelineZoom, setTimelineZoom] = useState(1);

  const animationLayers = [
    {
      name: "Player Movement",
      type: "Transform",
      enabled: true,
      locked: false,
      keyframes: [
        { frame: 0, value: { x: 0, y: 0, z: 0 }, type: "position" },
        { frame: 30, value: { x: 5, y: 0, z: 0 }, type: "position" },
        { frame: 60, value: { x: 5, y: 2, z: 0 }, type: "position" },
        { frame: 90, value: { x: 0, y: 2, z: 0 }, type: "position" },
        { frame: 120, value: { x: 0, y: 0, z: 0 }, type: "position" },
      ]
    },
    {
      name: "Player Rotation",
      type: "Transform",
      enabled: true,
      locked: false,
      keyframes: [
        { frame: 0, value: { x: 0, y: 0, z: 0 }, type: "rotation" },
        { frame: 30, value: { x: 0, y: 90, z: 0 }, type: "rotation" },
        { frame: 60, value: { x: 0, y: 180, z: 0 }, type: "rotation" },
        { frame: 90, value: { x: 0, y: 270, z: 0 }, type: "rotation" },
        { frame: 120, value: { x: 0, y: 360, z: 0 }, type: "rotation" },
      ]
    },
    {
      name: "Weapon Swing",
      type: "Transform",
      enabled: true,
      locked: false,
      keyframes: [
        { frame: 10, value: { x: 0, y: 0, z: 0 }, type: "rotation" },
        { frame: 25, value: { x: -90, y: 0, z: 0 }, type: "rotation" },
        { frame: 40, value: { x: 0, y: 0, z: 0 }, type: "rotation" },
      ]
    },
    {
      name: "Camera Shake",
      type: "Effect",
      enabled: false,
      locked: false,
      keyframes: [
        { frame: 25, value: { intensity: 0.5 }, type: "effect" },
        { frame: 35, value: { intensity: 0 }, type: "effect" },
      ]
    }
  ];

  const curveTypes = [
    { name: "Linear", value: "linear" },
    { name: "Ease In", value: "ease-in" },
    { name: "Ease Out", value: "ease-out" },
    { name: "Ease In-Out", value: "ease-in-out" },
    { name: "Bounce", value: "bounce" },
  ];

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFrameChange = (frame) => {
    setCurrentFrame(Math.max(0, Math.min(totalFrames, frame)));
  };

  const addKeyframe = (layerIndex, frame) => {
    // Implementation for adding keyframes
    console.log(`Adding keyframe to layer ${layerIndex} at frame ${frame}`);
  };

  const deleteKeyframe = (layerIndex, keyframeIndex) => {
    // Implementation for deleting keyframes
    console.log(`Deleting keyframe ${keyframeIndex} from layer ${layerIndex}`);
  };

  const toggleLayerVisibility = (layerIndex) => {
    // Implementation for toggling layer visibility
    console.log(`Toggling visibility for layer ${layerIndex}`);
  };

  const toggleLayerLock = (layerIndex) => {
    // Implementation for toggling layer lock
    console.log(`Toggling lock for layer ${layerIndex}`);
  };

  const renderTimelineRuler = () => {
    const markers = [];
    const step = Math.max(1, Math.floor(10 / timelineZoom));
    
    for (let i = 0; i <= totalFrames; i += step) {
      markers.push(
        <div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: `${(i / totalFrames) * 100}%` }}
        >
          <div className="w-px h-3 bg-gray-400"></div>
          <span className="text-xs text-gray-500 mt-1">{i}</span>
        </div>
      );
    }
    
    return markers;
  };

  const renderKeyframeTrack = (layer, layerIndex) => {
    return (
      <div className="relative h-8 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {layer.keyframes.map((keyframe, index) => (
          <div
            key={index}
            className={`absolute w-3 h-3 rounded-sm cursor-pointer transform -translate-x-1.5 -translate-y-0.5 top-1/2 ${
              keyframe.type === 'position' ? 'bg-blue-500' :
              keyframe.type === 'rotation' ? 'bg-green-500' :
              keyframe.type === 'scale' ? 'bg-purple-500' :
              'bg-orange-500'
            } ${selectedKeyframe?.layerIndex === layerIndex && selectedKeyframe?.keyframeIndex === index ? 
              'ring-2 ring-yellow-400' : ''}`}
            style={{ left: `${(keyframe.frame / totalFrames) * 100}%` }}
            onClick={() => setSelectedKeyframe({ layerIndex, keyframeIndex: index })}
            title={`${keyframe.type} at frame ${keyframe.frame}`}
          />
        ))}
      </div>
    );
  };

  const currentTime = (currentFrame / fps).toFixed(2);

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Play size={20} className="text-blue-600" />
              <span className="font-bold text-gray-900 dark:text-white">Animation Editor</span>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">File</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Edit</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Create</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Window</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Save Animation">
              <Save size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Settings">
              <Settings size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Animation Properties */}
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Animation Info */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Animation Clip</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input 
                  type="text" 
                  value="Player_Attack_Animation"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Length (frames)
                  </label>
                  <input 
                    type="number" 
                    value={totalFrames}
                    onChange={(e) => setTotalFrames(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    FPS
                  </label>
                  <input 
                    type="number" 
                    value={fps}
                    onChange={(e) => setFps(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {(totalFrames / fps).toFixed(2)} seconds
                </div>
              </div>
            </div>
          </div>

          {/* Keyframe Properties */}
          {selectedKeyframe && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Keyframe Properties</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Frame
                  </label>
                  <input 
                    type="number" 
                    value={animationLayers[selectedKeyframe.layerIndex].keyframes[selectedKeyframe.keyframeIndex].frame}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interpolation
                  </label>
                  <select className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500">
                    {curveTypes.map(curve => (
                      <option key={curve.value} value={curve.value}>{curve.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Value
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" placeholder="X" className="px-2 py-1 text-sm border rounded" />
                    <input type="number" placeholder="Y" className="px-2 py-1 text-sm border rounded" />
                    <input type="number" placeholder="Z" className="px-2 py-1 text-sm border rounded" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animation Layers */}
          <div className="flex-1 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Animation Layers</h4>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {animationLayers.map((layer, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedLayer === index 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedLayer(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${
                        layer.type === 'Transform' ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm font-medium">{layer.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(index);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {layer.enabled ? <Eye size={12} /> : <EyeOff size={12} />}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(index);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                      </button>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {layer.keyframes.length} keyframes • {layer.type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Timeline Area */}
        <div className="flex-1 flex flex-col">
          {/* Playback Controls */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleFrameChange(0)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <SkipBack size={16} />
                  </button>
                  <button 
                    onClick={handlePlay}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button 
                    onClick={() => setIsPlaying(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Square size={16} />
                  </button>
                  <button 
                    onClick={() => handleFrameChange(totalFrames)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Frame:</span>
                  <input 
                    type="number"
                    value={currentFrame}
                    onChange={(e) => handleFrameChange(parseInt(e.target.value))}
                    className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">/ {totalFrames}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{currentTime}s</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Zoom:</span>
                <button 
                  onClick={() => setTimelineZoom(Math.max(0.1, timelineZoom - 0.1))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm w-12 text-center">{Math.round(timelineZoom * 100)}%</span>
                <button 
                  onClick={() => setTimelineZoom(Math.min(3, timelineZoom + 0.1))}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-900">
            {/* Timeline Ruler */}
            <div className="h-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative">
              {renderTimelineRuler()}
              {/* Current Time Indicator */}
              <div 
                className="absolute top-0 bottom-0 w-px bg-red-500 z-10"
                style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
              >
                <div className="absolute -top-1 left-0 w-3 h-3 bg-red-500 transform -translate-x-1.5 rotate-45" />
              </div>
            </div>

            {/* Animation Tracks */}
            <div className="flex">
              {/* Track Labels */}
              <div className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                {animationLayers.map((layer, index) => (
                  <div 
                    key={index}
                    className={`h-8 px-3 flex items-center border-b border-gray-200 dark:border-gray-700 cursor-pointer ${
                      selectedLayer === index ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedLayer(index)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className={`w-2 h-2 rounded ${
                        layer.type === 'Transform' ? 'bg-blue-500' : 'bg-orange-500'
                      }`} />
                      <span className="text-sm truncate">{layer.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerVisibility(index);
                        }}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {layer.enabled ? <Eye size={10} /> : <EyeOff size={10} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline Tracks */}
              <div className="flex-1 relative" style={{ transform: `scaleX(${timelineZoom})`, transformOrigin: 'left' }}>
                {animationLayers.map((layer, index) => renderKeyframeTrack(layer, index))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Animation Preview</h3>
          </div>
          
          {/* 3D Preview Area */}
          <div className="h-64 bg-gray-900 m-4 rounded-lg flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <Box size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">3D Animation Preview</p>
              <p className="text-xs opacity-75">Frame {currentFrame}</p>
            </div>
          </div>

          {/* Animation Curves */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Animation Curves</h4>
            <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded border relative">
              <div className="absolute inset-0 p-2">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <path 
                    d="M 0 50 Q 25 20, 50 50 T 100 50" 
                    stroke="#3B82F6" 
                    strokeWidth="2" 
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Position X curve for selected layer
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Frame: {currentFrame}/{totalFrames}</span>
          <span>Time: {currentTime}s</span>
          <span>FPS: {fps}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Layers: {animationLayers.length}</span>
          <span>Keyframes: {animationLayers.reduce((sum, layer) => sum + layer.keyframes.length, 0)}</span>
          <span>{isPlaying ? 'Playing' : 'Stopped'}</span>
        </div>
      </div>
    </div>
  );
}