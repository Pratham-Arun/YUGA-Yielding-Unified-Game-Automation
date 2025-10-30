import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectEditor from './pages/ProjectEditor';
import GameEngine from './pages/GameEngine';
import AnimationEditor from './pages/AnimationEditor';
import VisualScripting from './pages/VisualScripting';
import AssetGenerator from './pages/AssetGenerator';
import AIModels from './pages/AIModels';
import Settings from './pages/Settings';
import WorldBuilder from './pages/WorldBuilder';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectEditor />} />
          <Route path="/game-engine" element={<GameEngine />} />
          <Route path="/animation-editor" element={<AnimationEditor />} />
          <Route path="/visual-scripting" element={<VisualScripting />} />
          <Route path="/asset-generator" element={<AssetGenerator />} />
          <Route path="/world-builder" element={<WorldBuilder />} />
          <Route path="/ai-models" element={<AIModels />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
