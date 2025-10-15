import React, { useState } from "react";
import {
  Code2,
  Play,
  Copy,
  Download,
  Wand2,
  Bug,
  Lightbulb,
  FileCode,
  Zap,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Send,
  Sparkles,
} from "lucide-react";

export default function AICodeAssistant() {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [language, setLanguage] = useState("C#");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const languages = ["C#", "C++", "Python", "Java"];
  
  const codeTemplates = [
    {
      title: "Player Movement Script",
      description: "Basic character controller with WASD movement",
      prompt: "Create a Unity player movement script with WASD controls, jumping, and smooth camera follow"
    },
    {
      title: "AI Enemy Behavior",
      description: "Enemy AI that follows and attacks player",
      prompt: "Create an AI enemy script that patrols, detects player within range, and attacks"
    },
    {
      title: "Inventory System",
      description: "Item collection and management system",
      prompt: "Create an inventory system that can add, remove, and display items with drag and drop"
    },
    {
      title: "Dialogue System",
      description: "NPC conversation manager",
      prompt: "Create a dialogue system with multiple choice responses and character portraits"
    }
  ];

  const recentGenerations = [
    {
      title: "Sword Combat System",
      language: "C#",
      time: "2 minutes ago",
      lines: 45
    },
    {
      title: "Magic Spell Casting",
      language: "C#", 
      time: "15 minutes ago",
      lines: 67
    },
    {
      title: "Blacksmith Crafting",
      language: "C#",
      time: "1 hour ago", 
      lines: 89
    }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI code generation
    setTimeout(() => {
      const sampleCode = `using UnityEngine;

public class ${prompt.includes('player') ? 'PlayerController' : 'GameScript'} : MonoBehaviour
{
    [Header("Settings")]
    public float moveSpeed = 5f;
    public float jumpForce = 10f;
    
    private Rigidbody rb;
    private bool isGrounded;
    
    void Start()
    {
        rb = GetComponent<Rigidbody>();
    }
    
    void Update()
    {
        HandleMovement();
        HandleJump();
    }
    
    void HandleMovement()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector3 movement = new Vector3(horizontal, 0f, vertical) * moveSpeed * Time.deltaTime;
        transform.Translate(movement);
    }
    
    void HandleJump()
    {
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            isGrounded = false;
        }
    }
    
    void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }
}`;
      
      setGeneratedCode(sampleCode);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-teal-600 rounded-xl flex items-center justify-center mr-4">
              <Code2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                AI Code Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Generate Unity C# scripts with natural language prompts
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Generation Input */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Describe What You Want to Create
              </h2>
              
              {/* Language Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Programming Language
                </label>
                <div className="relative">
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prompt Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a player movement script with WASD controls and jumping for Unity..."
                  className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Code...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="mr-2" />
                    Generate Code
                  </>
                )}
              </button>
            </div>

            {/* Generated Code Output */}
            {generatedCode && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileCode size={20} className="text-green-600 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Generated {language} Script
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center"
                    >
                      <Copy size={16} className="mr-2" />
                      Copy
                    </button>
                    <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors flex items-center">
                      <Download size={16} className="mr-2" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="p-0">
                  <pre className="bg-gray-900 text-gray-100 p-6 overflow-x-auto text-sm">
                    <code>{generatedCode}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Templates */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Templates
              </h3>
              <div className="space-y-3">
                {codeTemplates.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(template.prompt)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
                  >
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {template.title}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Generations */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Generations
              </h3>
              <div className="space-y-3">
                {recentGenerations.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.title}
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.language}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {item.lines} lines • {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Features */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
              <div className="flex items-center mb-3">
                <Zap size={20} className="mr-2" />
                <h3 className="font-semibold">AI Features</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-200" />
                  Live debugging suggestions
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-200" />
                  Code optimization tips
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-200" />
                  Unity best practices
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2 text-green-200" />
                  Error detection & fixes
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}