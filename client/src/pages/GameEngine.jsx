/**
 * YUGA Engine - Game Engine Component
 * 
 * This file contains code and design patterns inspired by Godot Engine
 * Copyright (c) 2014-present Godot Engine contributors
 * Copyright (c) 2007-2014 Juan Linietsky, Ariel Manzur
 * Licensed under MIT License - See GODOT_LICENSE.txt
 * 
 * Scene hierarchy, inspector panels, and transform controls are based on
 * Godot Engine's architecture with modifications for YUGA Engine.
 */

import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, Pause, Square, Maximize2, Grid3x3, Box, Lightbulb, 
  Move, RotateCw, Maximize, Eye, EyeOff, Lock, Unlock,
  Layers, Camera, Sun, Plus
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export default function GameEngine() {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const transformControlsRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [sceneObjects, setSceneObjects] = useState([]);
  const [transformMode, setTransformMode] = useState('translate'); // translate, rotate, scale
  const [viewMode, setViewMode] = useState('perspective'); // perspective, top, front, side
  const [showGrid, setShowGrid] = useState(true);
  const [showGizmos, setShowGizmos] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Transform Controls for editing objects
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    // Click handler for object selection
    const handleCanvasClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        // Don't select ground, grid, or helpers
        if (object.name && object.type === 'Mesh' && object !== ground) {
          setSelectedObject(object);
          transformControls.attach(object);
        }
      } else {
        setSelectedObject(null);
        transformControls.detach();
      }
    };

    renderer.domElement.addEventListener('click', handleCanvasClick);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Sample cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x3498db });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = 0.5;
    cube.castShadow = true;
    cube.name = 'Cube';
    scene.add(cube);

    setSceneObjects([
      { id: 'cube', name: 'Cube', type: 'Mesh', position: { x: 0, y: 0.5, z: 0 } }
    ]);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      if (isPlaying) {
        cube.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, [isPlaying]);

  const handleAddCube = () => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(
      (Math.random() - 0.5) * 5,
      0.5,
      (Math.random() - 0.5) * 5
    );
    cube.castShadow = true;
    cube.name = `Cube_${Date.now()}`;
    sceneRef.current.add(cube);

    setSceneObjects(prev => [...prev, {
      id: cube.name,
      name: cube.name,
      type: 'Mesh',
      position: cube.position
    }]);
  };

  const handleAddSphere = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      (Math.random() - 0.5) * 5,
      0.5,
      (Math.random() - 0.5) * 5
    );
    sphere.castShadow = true;
    sphere.name = `Sphere_${Date.now()}`;
    sceneRef.current.add(sphere);

    setSceneObjects(prev => [...prev, {
      id: sphere.name,
      name: sphere.name,
      type: 'Mesh',
      position: sphere.position
    }]);
  };

  const handleAddCylinder = () => {
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(
      (Math.random() - 0.5) * 5,
      0.5,
      (Math.random() - 0.5) * 5
    );
    cylinder.castShadow = true;
    cylinder.name = `Cylinder_${Date.now()}`;
    sceneRef.current.add(cylinder);

    setSceneObjects(prev => [...prev, {
      id: cylinder.name,
      name: cylinder.name,
      type: 'Mesh',
      position: cylinder.position
    }]);
  };

  const handleAddLight = () => {
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(
      (Math.random() - 0.5) * 10,
      5,
      (Math.random() - 0.5) * 10
    );
    light.castShadow = true;
    light.name = `Light_${Date.now()}`;
    sceneRef.current.add(light);

    // Add light helper
    const helper = new THREE.PointLightHelper(light, 0.5);
    sceneRef.current.add(helper);

    setSceneObjects(prev => [...prev, {
      id: light.name,
      name: light.name,
      type: 'Light',
      position: light.position
    }]);
  };

  const handleAddCamera = () => {
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(
      (Math.random() - 0.5) * 10,
      2,
      (Math.random() - 0.5) * 10
    );
    camera.name = `Camera_${Date.now()}`;
    sceneRef.current.add(camera);

    // Add camera helper
    const helper = new THREE.CameraHelper(camera);
    sceneRef.current.add(helper);

    setSceneObjects(prev => [...prev, {
      id: camera.name,
      name: camera.name,
      type: 'Camera',
      position: camera.position
    }]);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    
    if (!camera || !controls) return;

    switch(mode) {
      case 'top':
        camera.position.set(0, 10, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'front':
        camera.position.set(0, 0, 10);
        camera.lookAt(0, 0, 0);
        break;
      case 'right':
        camera.position.set(10, 0, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'perspective':
      default:
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        break;
    }
    
    controls.update();
  };

  // Update transform controls mode when transform mode changes
  useEffect(() => {
    const transformControls = transformControlsRef.current;
    if (transformControls) {
      transformControls.setMode(transformMode);
    }
  }, [transformMode]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const container = document.querySelector('.game-engine-container');
    if (!document.fullscreenElement) {
      container?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  return (
    <div className="flex h-screen game-engine-container">
      {/* Scene Hierarchy */}
      <div className="w-64 glass-dark border-r border-white/10 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Grid3x3 className="w-5 h-5" />
          Scene Hierarchy
        </h2>
        <div className="space-y-1">
          {sceneObjects.map(obj => (
            <div
              key={obj.id}
              onClick={() => setSelectedObject(obj)}
              className={`p-2 rounded cursor-pointer transition-colors ${
                selectedObject?.id === obj.id
                  ? 'bg-indigo-600'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4" />
                <span className="text-sm">{obj.name}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Add Object Menu (Unity Style) */}
        <div className="mt-4 space-y-2">
          <div className="text-xs font-medium text-slate-400 mb-2">CREATE</div>
          <button
            onClick={handleAddCube}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <Box className="w-4 h-4" />
            Cube
          </button>
          <button
            onClick={handleAddSphere}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <Box className="w-4 h-4" />
            Sphere
          </button>
          <button
            onClick={handleAddCylinder}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <Box className="w-4 h-4" />
            Cylinder
          </button>
          <button
            onClick={handleAddLight}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <Sun className="w-4 h-4" />
            Light
          </button>
          <button
            onClick={handleAddCamera}
            className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <Camera className="w-4 h-4" />
            Camera
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="glass-dark border-b border-white/10 p-3">
          <div className="flex items-center justify-between mb-2">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2 rounded-lg transition-colors ${
                  isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
                }`}
                title="Play/Pause"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Stop">
                <Square className="w-4 h-4" />
              </button>
            </div>

            {/* Transform Tools (Unity/Godot Style) */}
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setTransformMode('translate')}
                className={`p-2 rounded transition-colors ${
                  transformMode === 'translate' ? 'bg-indigo-600' : 'hover:bg-white/5'
                }`}
                title="Move (W)"
              >
                <Move className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTransformMode('rotate')}
                className={`p-2 rounded transition-colors ${
                  transformMode === 'rotate' ? 'bg-indigo-600' : 'hover:bg-white/5'
                }`}
                title="Rotate (E)"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTransformMode('scale')}
                className={`p-2 rounded transition-colors ${
                  transformMode === 'scale' ? 'bg-indigo-600' : 'hover:bg-white/5'
                }`}
                title="Scale (R)"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            {/* View Options */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? 'bg-indigo-600/20' : 'hover:bg-white/5'
                }`}
                title="Toggle Grid"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowGizmos(!showGizmos)}
                className={`p-2 rounded-lg transition-colors ${
                  showGizmos ? 'bg-indigo-600/20' : 'hover:bg-white/5'
                }`}
                title="Toggle Gizmos"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Lighting">
                <Lightbulb className="w-4 h-4" />
              </button>
              <button 
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg transition-colors ${
                  isFullscreen ? 'bg-indigo-600/20' : 'hover:bg-white/5'
                }`}
                title="Toggle Fullscreen (F11)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Camera View Modes (Godot Style) */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-slate-400 mr-2">View:</span>
            {['Perspective', 'Top', 'Front', 'Right'].map((view) => (
              <button
                key={view}
                onClick={() => handleViewModeChange(view.toLowerCase())}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  viewMode === view.toLowerCase() ? 'bg-indigo-600' : 'hover:bg-white/5'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Viewport */}
        <div ref={canvasRef} className="flex-1 bg-slate-900" />

        {/* Stats Bar */}
        <div className="glass-dark border-t border-white/10 p-2 text-xs text-slate-400 flex items-center gap-4">
          <span>Objects: {sceneObjects.length}</span>
          <span>Vertices: {sceneObjects.length * 8}</span>
          <span>FPS: 60</span>
        </div>
      </div>

      {/* Inspector Panel (Unity Style) */}
      <div className="w-80 glass-dark border-l border-white/10 overflow-y-auto">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-bold">Inspector</h2>
        </div>
        
        {selectedObject ? (
          <div className="p-4 space-y-3">
            {/* Object Name & Active Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4"
              />
              <input
                type="text"
                value={selectedObject.name}
                className="flex-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-sm font-medium"
                readOnly
              />
            </div>

            {/* Tag & Layer (Unity) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-400">Tag</label>
                <select className="w-full mt-1 px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs">
                  <option>Untagged</option>
                  <option>Player</option>
                  <option>Enemy</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Layer</label>
                <select className="w-full mt-1 px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs">
                  <option>Default</option>
                  <option>UI</option>
                  <option>Ground</option>
                </select>
              </div>
            </div>

            {/* Transform Component */}
            <div className="glass-dark rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transform</span>
                <Lock className="w-3 h-3 text-slate-400" />
              </div>
              
              <div>
                <label className="text-xs text-slate-400">Position</label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">X</div>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedObject.position.x.toFixed(2)}
                      onChange={(e) => {
                        selectedObject.position.x = parseFloat(e.target.value);
                      }}
                      className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Y</div>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedObject.position.y.toFixed(2)}
                      onChange={(e) => {
                        selectedObject.position.y = parseFloat(e.target.value);
                      }}
                      className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Z</div>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedObject.position.z.toFixed(2)}
                      onChange={(e) => {
                        selectedObject.position.z = parseFloat(e.target.value);
                      }}
                      className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Rotation</label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis}>
                      <div className="text-xs text-slate-500 mb-1">{axis}</div>
                      <input
                        type="number"
                        defaultValue="0"
                        className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400">Scale</label>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  {['X', 'Y', 'Z'].map((axis) => (
                    <div key={axis}>
                      <div className="text-xs text-slate-500 mb-1">{axis}</div>
                      <input
                        type="number"
                        defaultValue="1"
                        className="w-full px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mesh Renderer Component */}
            <div className="glass-dark rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mesh Renderer</span>
                <input type="checkbox" defaultChecked className="w-3 h-3" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Material</label>
                <select className="w-full mt-1 px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs">
                  <option>Standard</option>
                  <option>Metallic</option>
                  <option>Emissive</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Cast Shadows</label>
                <select className="w-full mt-1 px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs">
                  <option>On</option>
                  <option>Off</option>
                  <option>Two Sided</option>
                </select>
              </div>
            </div>

            {/* Box Collider Component */}
            <div className="glass-dark rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Box Collider</span>
                <input type="checkbox" defaultChecked className="w-3 h-3" />
              </div>
              <div>
                <label className="text-xs text-slate-400 flex items-center gap-2">
                  <input type="checkbox" className="w-3 h-3" />
                  Is Trigger
                </label>
              </div>
              <div>
                <label className="text-xs text-slate-400">Material</label>
                <select className="w-full mt-1 px-2 py-1 bg-slate-800 border border-white/10 rounded text-xs">
                  <option>None</option>
                  <option>Bouncy</option>
                  <option>Friction</option>
                </select>
              </div>
            </div>

            {/* Add Component Button */}
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
              <Plus className="w-4 h-4" />
              Add Component
            </button>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-sm text-slate-400 text-center">Select an object to view properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
