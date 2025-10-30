/**
 * YUGA Engine - Animation Editor Component
 * 
 * This file contains timeline-based animation concepts inspired by Godot Engine
 * Copyright (c) 2014-present Godot Engine contributors
 * Copyright (c) 2007-2014 Juan Linietsky, Ariel Manzur
 * Licensed under MIT License - See GODOT_LICENSE.txt
 * 
 * Timeline editor and keyframe system are based on Godot's AnimationPlayer
 * with modifications for YUGA Engine's web-based implementation.
 */

import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2 } from 'lucide-react';

export default function AnimationEditor() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [keyframes, setKeyframes] = useState([
    { frame: 0, property: 'position.x', value: 0 },
    { frame: 30, property: 'position.x', value: 5 },
    { frame: 60, property: 'position.x', value: 0 },
  ]);

  const totalFrames = 120;
  const fps = 30;

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="glass-dark border-b border-white/10 p-4">
        <h1 className="text-2xl font-bold">Animation Editor</h1>
        <p className="text-sm text-slate-400">Timeline-based animation system</p>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex">
        {/* 3D Preview */}
        <div className="flex-1 bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-indigo-600 rounded-lg mb-4 mx-auto" />
            <p className="text-slate-400">3D Preview</p>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 glass-dark border-l border-white/10 p-4">
          <h2 className="text-lg font-bold mb-4">Animation Properties</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400">Duration</label>
              <input
                type="number"
                value={totalFrames / fps}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">FPS</label>
              <input
                type="number"
                value={fps}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Total Frames</label>
              <input
                type="number"
                value={totalFrames}
                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="h-64 glass-dark border-t border-white/10">
        {/* Playback Controls */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg transition-colors ${
                isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-slate-400">
            Frame: {currentFrame} / {totalFrames}
          </div>
        </div>

        {/* Timeline Tracks */}
        <div className="p-4 overflow-auto">
          <div className="space-y-2">
            {['Position X', 'Position Y', 'Position Z', 'Rotation', 'Scale'].map((track, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-32 text-sm text-slate-400">{track}</div>
                <div className="flex-1 h-8 bg-slate-800 rounded relative">
                  {/* Timeline ruler */}
                  <div className="absolute inset-0 flex">
                    {Array.from({ length: totalFrames / 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 border-r border-white/5"
                        style={{ width: `${100 / (totalFrames / 10)}%` }}
                      />
                    ))}
                  </div>
                  {/* Keyframes */}
                  {keyframes
                    .filter(kf => kf.property.includes(track.toLowerCase().replace(' ', '.')))
                    .map((kf, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-500 rounded-full cursor-pointer hover:scale-125 transition-transform"
                        style={{ left: `${(kf.frame / totalFrames) * 100}%` }}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
