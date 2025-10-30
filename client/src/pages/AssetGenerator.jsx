import React, { useState } from 'react';
import { Sparkles, Download, RefreshCw, Image, Box, Palette } from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';

export default function AssetGenerator() {
  const { selectedModel } = useStore();
  const [prompt, setPrompt] = useState('');
  const [assetType, setAssetType] = useState('3d-model');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState([]);

  const assetTypes = [
    { value: '3d-model', label: '3D Model', icon: Box },
    { value: 'texture', label: 'Texture', icon: Palette },
    { value: 'sprite', label: '2D Sprite', icon: Image },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a description');
      return;
    }

    setIsGenerating(true);
    try {
      // Call backend to generate asset
      const response = await axios.post('/api/ai/generate-asset', {
        prompt,
        assetType,
        style: document.querySelector('select[name="style"]')?.value || 'realistic',
        quality: document.querySelector('select[name="quality"]')?.value || 'medium'
      });
      
      const newAsset = {
        id: Date.now(),
        type: assetType,
        prompt,
        preview: response.data.imageUrl || response.data.url,
        downloadUrl: response.data.downloadUrl || response.data.url,
        createdAt: new Date().toISOString(),
      };

      setGeneratedAssets([newAsset, ...generatedAssets]);
      setPrompt('');
    } catch (error) {
      console.error('Failed to generate asset:', error);
      alert('Failed to generate asset: ' + (error.response?.data?.error || error.message));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (asset) => {
    try {
      const response = await fetch(asset.downloadUrl || asset.preview);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${asset.type}-${asset.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download asset');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Generation Panel */}
      <div className="w-96 glass-dark border-r border-white/10 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-400" />
          AI Asset Generator
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Generate 3D models, textures, and sprites using AI
        </p>

        {/* Asset Type Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Asset Type</label>
          <div className="grid grid-cols-3 gap-2">
            {assetTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  onClick={() => setAssetType(type.value)}
                  className={`p-3 rounded-lg border transition-colors ${
                    assetType === type.value
                      ? 'bg-indigo-600 border-indigo-500'
                      : 'bg-slate-800 border-white/10 hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs">{type.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Description</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the asset you want to generate..."
            className="w-full h-32 px-3 py-2 bg-slate-800 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Style Options */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Art Style</label>
          <select name="style" className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="realistic">Realistic</option>
            <option value="cartoon">Cartoon</option>
            <option value="low-poly">Low Poly</option>
            <option value="pixel-art">Pixel Art</option>
            <option value="stylized">Stylized</option>
          </select>
        </div>

        {/* Quality Settings */}
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">Quality</label>
          <select name="quality" className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="draft">Draft (Fast)</option>
            <option value="medium">Standard</option>
            <option value="high">High Quality</option>
            <option>Ultra (Slow)</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Asset
            </>
          )}
        </button>
      </div>

      {/* Preview & Gallery */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass-dark border-b border-white/10 p-4">
          <h2 className="text-xl font-bold">Generated Assets</h2>
          <p className="text-sm text-slate-400">
            {generatedAssets.length} asset{generatedAssets.length !== 1 ? 's' : ''} generated
          </p>
        </div>

        {/* Gallery */}
        <div className="flex-1 p-6 overflow-y-auto">
          {generatedAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Sparkles className="w-16 h-16 text-slate-600 mb-4" />
              <h3 className="text-lg font-medium text-slate-400 mb-2">
                No assets generated yet
              </h3>
              <p className="text-sm text-slate-500">
                Enter a description and click "Generate Asset" to create your first asset
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {generatedAssets.map((asset) => (
                <div
                  key={asset.id}
                  className="glass rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="aspect-square bg-slate-800 flex items-center justify-center">
                    <img
                      src={asset.preview}
                      alt={asset.prompt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-xs text-slate-400 mb-1">
                      {assetTypes.find(t => t.value === asset.type)?.label}
                    </div>
                    <div className="text-sm font-medium line-clamp-2 mb-2">
                      {asset.prompt}
                    </div>
                    <button 
                      onClick={() => handleDownload(asset)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
