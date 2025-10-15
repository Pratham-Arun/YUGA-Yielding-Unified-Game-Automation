import React, { useState } from "react";
import {
  Code2,
  Save,
  Play,
  FolderOpen,
  Search,
  Replace,
  Settings,
  Bug,
  FileText,
  Plus,
  X,
  ChevronRight,
  ChevronDown,
  Terminal,
  Zap,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Maximize2,
  Copy,
  Scissors,
  Undo,
  Redo,
} from "lucide-react";

export default function ScriptEditor() {
  const [activeFile, setActiveFile] = useState("PlayerController.cs");
  const [openFiles, setOpenFiles] = useState([
    { name: "PlayerController.cs", path: "/Scripts/PlayerController.cs", modified: true },
    { name: "GameManager.cs", path: "/Scripts/GameManager.cs", modified: false },
    { name: "EnemyAI.cs", path: "/Scripts/EnemyAI.cs", modified: false },
  ]);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [showConsole, setShowConsole] = useState(true);
  const [consoleHeight, setConsoleHeight] = useState(200);

  const fileTree = [
    {
      name: "Scripts",
      type: "folder",
      expanded: true,
      children: [
        { name: "PlayerController.cs", type: "file", icon: Code2 },
        { name: "GameManager.cs", type: "file", icon: Code2 },
        { name: "EnemyAI.cs", type: "file", icon: Code2 },
        { name: "InventorySystem.cs", type: "file", icon: Code2 },
      ]
    },
    {
      name: "Editor",
      type: "folder",
      expanded: false,
      children: [
        { name: "CustomInspector.cs", type: "file", icon: Code2 },
        { name: "BuildTools.cs", type: "file", icon: Code2 },
      ]
    }
  ];

  const errors = [
    { type: "error", line: 45, message: "CS0103: The name 'rigidbody' does not exist in the current context", file: "PlayerController.cs" },
    { type: "warning", line: 23, message: "CS0649: Field 'GameManager.instance' is never assigned to", file: "GameManager.cs" },
  ];

  const suggestions = [
    "Add using UnityEngine;",
    "Declare rigidbody variable",
    "Initialize component in Start()",
    "Add null check before usage"
  ];

  const sampleCode = `using UnityEngine;

public class PlayerController : MonoBehaviour
{
    [Header("Movement Settings")]
    public float moveSpeed = 5f;
    public float jumpForce = 10f;
    public float rotationSpeed = 720f;
    
    [Header("Ground Detection")]
    public Transform groundCheck;
    public float groundDistance = 0.4f;
    public LayerMask groundMask;
    
    private Rigidbody rb;
    private bool isGrounded;
    private Vector3 velocity;
    private float horizontalInput;
    private float verticalInput;
    
    void Start()
    {
        rb = GetComponent<Rigidbody>();
        if (rb == null)
        {
            Debug.LogError("Rigidbody component missing!");
        }
    }
    
    void Update()
    {
        HandleInput();
        CheckGroundStatus();
        HandleMovement();
        HandleJump();
    }
    
    void HandleInput()
    {
        horizontalInput = Input.GetAxis("Horizontal");
        verticalInput = Input.GetAxis("Vertical");
    }
    
    void CheckGroundStatus()
    {
        isGrounded = Physics.CheckSphere(groundCheck.position, groundDistance, groundMask);
    }
    
    void HandleMovement()
    {
        Vector3 direction = transform.right * horizontalInput + transform.forward * verticalInput;
        
        if (direction.magnitude >= 0.1f)
        {
            float targetAngle = Mathf.Atan2(direction.x, direction.z) * Mathf.Rad2Deg;
            float angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, 
                ref velocity.y, rotationSpeed * Time.deltaTime);
            
            transform.rotation = Quaternion.AngleAxis(angle, Vector3.up);
            rb.MovePosition(transform.position + direction * moveSpeed * Time.deltaTime);
        }
    }
    
    void HandleJump()
    {
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
        }
    }
    
    void OnDrawGizmosSelected()
    {
        if (groundCheck != null)
        {
            Gizmos.color = isGrounded ? Color.green : Color.red;
            Gizmos.DrawSphere(groundCheck.position, groundDistance);
        }
    }
}`;

  const renderFileTree = (items, level = 0) => {
    return items.map((item, index) => (
      <div key={index}>
        <div 
          className={`flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
            activeFile === item.name ? 'bg-blue-100 dark:bg-blue-900/30' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => item.type === 'file' && setActiveFile(item.name)}
        >
          {item.type === 'folder' && (
            <button className="mr-1 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded">
              {item.expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          )}
          {item.type === 'file' && <div className="w-4" />}
          {item.icon && <item.icon size={14} className="mr-2 text-blue-600" />}
          {!item.icon && (
            <FolderOpen size={14} className="mr-2 text-yellow-600" />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
        {item.children && item.expanded && (
          <div>{renderFileTree(item.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const closeFile = (fileName) => {
    setOpenFiles(openFiles.filter(file => file.name !== fileName));
    if (activeFile === fileName && openFiles.length > 1) {
      const remainingFiles = openFiles.filter(file => file.name !== fileName);
      setActiveFile(remainingFiles[0].name);
    }
  };

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Code2 size={20} className="text-blue-600" />
              <span className="font-bold text-gray-900 dark:text-white">Script Editor</span>
            </div>
            <div className="flex gap-1">
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">File</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Edit</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">View</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Tools</button>
              <button className="px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded">Help</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Save (Ctrl+S)">
              <Save size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Run Script">
              <Play size={16} />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Debug">
              <Bug size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Undo (Ctrl+Z)">
            <Undo size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Redo (Ctrl+Y)">
            <Redo size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Cut (Ctrl+X)">
            <Scissors size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Copy (Ctrl+C)">
            <Copy size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Find (Ctrl+F)">
            <Search size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Replace (Ctrl+H)">
            <Replace size={16} />
          </button>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="AI Assist">
            <Zap size={16} />
          </button>
          <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="Suggestions">
            <Lightbulb size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Explorer Sidebar */}
        <div 
          className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col"
          style={{ width: sidebarWidth }}
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Explorer</h3>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <Plus size={14} />
              </button>
            </div>
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search files..."
                className="w-full pl-8 pr-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderFileTree(fileTree)}
          </div>

          {/* AI Suggestions Panel */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-3">
            <div className="flex items-center mb-2">
              <Lightbulb size={14} className="mr-2 text-yellow-500" />
              <h4 className="text-xs font-medium">AI Suggestions</h4>
            </div>
            <div className="space-y-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full text-left text-xs p-2 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* File Tabs */}
          <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex">
            {openFiles.map((file) => (
              <div
                key={file.name}
                className={`flex items-center px-4 py-2 border-r border-gray-200 dark:border-gray-600 cursor-pointer ${
                  activeFile === file.name 
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveFile(file.name)}
              >
                <Code2 size={14} className="mr-2" />
                <span className="text-sm">{file.name}</span>
                {file.modified && <div className="w-2 h-2 bg-orange-500 rounded-full ml-2" />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(file.name);
                  }}
                  className="ml-2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Code Editor */}
          <div className="flex-1 flex">
            <div className="flex-1 relative">
              {/* Line Numbers */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 font-mono text-xs text-gray-500 dark:text-gray-400">
                {sampleCode.split('\n').map((_, index) => (
                  <div key={index} className="px-2 py-0.5 text-right">
                    {index + 1}
                  </div>
                ))}
              </div>

              {/* Code Content */}
              <div className="ml-12 h-full">
                <textarea
                  value={sampleCode}
                  className="w-full h-full p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm border-0 resize-none focus:outline-none"
                  style={{ fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace' }}
                  spellCheck={false}
                />
              </div>

              {/* Error Indicators */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gray-100 dark:bg-gray-800">
                {errors.map((error, index) => (
                  <div
                    key={index}
                    className={`absolute w-full h-1 ${
                      error.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    style={{ top: `${(error.line / sampleCode.split('\n').length) * 100}%` }}
                    title={error.message}
                  />
                ))}
              </div>
            </div>

            {/* Minimap */}
            <div className="w-20 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-600">
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Console/Output Panel */}
      {showConsole && (
        <div 
          className="border-t border-gray-200 dark:border-gray-700 bg-gray-900"
          style={{ height: consoleHeight }}
        >
          <div className="flex items-center justify-between p-2 border-b border-gray-700">
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white">Output</button>
              <button className="px-3 py-1 text-xs hover:bg-gray-700 rounded text-gray-300">Problems</button>
              <button className="px-3 py-1 text-xs hover:bg-gray-700 rounded text-gray-300">Terminal</button>
            </div>
            <button 
              onClick={() => setShowConsole(false)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400"
            >
              <X size={14} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 font-mono text-xs text-gray-100">
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index} className={`flex items-start gap-2 ${
                  error.type === 'error' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {error.type === 'error' ? (
                    <AlertTriangle size={14} className="mt-0.5" />
                  ) : (
                    <AlertTriangle size={14} className="mt-0.5" />
                  )}
                  <div>
                    <div>{error.message}</div>
                    <div className="text-gray-500 text-xs">{error.file}:{error.line}</div>
                  </div>
                </div>
              ))}
              <div className="text-green-400 flex items-center gap-2">
                <CheckCircle size={14} />
                <span>Build completed successfully</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-4">
          <span>Ln 45, Col 12</span>
          <span>C#</span>
          <span>UTF-8</span>
          <button 
            onClick={() => setShowConsole(!showConsole)}
            className="hover:text-gray-900 dark:hover:text-gray-200"
          >
            {errors.filter(e => e.type === 'error').length} errors, {errors.filter(e => e.type === 'warning').length} warnings
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span>AI Assistant: Ready</span>
          <span>IntelliSense: Active</span>
        </div>
      </div>
    </div>
  );
}