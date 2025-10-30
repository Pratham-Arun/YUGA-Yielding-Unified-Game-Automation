import { create } from 'zustand';

const useStore = create((set, get) => ({
      // Projects
      projects: [],
      currentProject: null,
      
      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) => set({ currentProject: project }),
      
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),
      
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates } 
          : state.currentProject
      })),
      
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(p => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject
      })),
      
      // AI Models Configuration
      aiModels: {
        // 🧠 Code Generation & Debugging
        code: {
          free: { 
            enabled: true, 
            apiKey: '', 
            models: [
              'deepseek-r1-0528',
              'deepseek-v3-0324', 
              'gpt-5-codex',
              'swe-1',
              'grok-code-fast-1',
              'starcoder2',
              'phind-code'
            ] 
          },
          openai: { enabled: false, apiKey: '', models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o', 'gpt-4.1', 'gpt-5'] },
          anthropic: { 
            enabled: false, 
            apiKey: '', 
            models: ['claude-3.5-sonnet', 'claude-3.7-sonnet', 'claude-opus-4', 'claude-sonnet-4.5'] 
          },
          google: { enabled: false, apiKey: '', models: ['gemini-1.5-pro', 'gemini-2.5-pro'] },
          xai: { enabled: false, apiKey: '', models: ['grok-3', 'grok-3-mini'] },
          mistral: { enabled: false, apiKey: '', models: ['mistral-large', 'mixtral-8x7b'] },
          deepseek: { enabled: false, apiKey: '', models: ['deepseek-coder', 'deepseek-chat'] },
          ollama: { 
            enabled: false, 
            endpoint: 'http://localhost:11434', 
            models: ['codellama', 'deepseek-coder', 'mixtral', 'starcoder2'] 
          },
        },
        
        // 🎨 Graphics & Asset Generation
        graphics: {
          stability: { 
            enabled: false, 
            apiKey: '', 
            models: ['stable-diffusion-xl', 'stable-diffusion-3', 'sdxl-turbo'] 
          },
          openai: { enabled: false, apiKey: '', models: ['dall-e-3', 'dall-e-2'] },
          leonardo: { enabled: false, apiKey: '', models: ['leonardo-diffusion', 'leonardo-creative'] },
          runway: { enabled: false, apiKey: '', models: ['gen-2', 'gen-3'] },
          scenario: { enabled: false, apiKey: '', models: ['scenario-v1'] },
          blockade: { enabled: false, apiKey: '', models: ['skybox-ai'] },
          meshy: { enabled: false, apiKey: '', models: ['text-to-3d', 'image-to-3d'] },
          kaedim: { enabled: false, apiKey: '', models: ['2d-to-3d'] },
        },
        
        // 🎬 Animation & Voice
        animation: {
          deepmotion: { enabled: false, apiKey: '', models: ['motion-capture', 'animate'] },
          elevenlabs: { enabled: false, apiKey: '', models: ['tts-multilingual', 'voice-clone'] },
          altered: { enabled: false, apiKey: '', models: ['voice-clone', 'tts'] },
          rvc: { enabled: false, endpoint: 'http://localhost:7865', models: ['voice-conversion'] },
        },
        
        // 🌐 Game Design & Logic
        gameDesign: {
          openai: { enabled: false, apiKey: '', models: ['gpt-4', 'gpt-4-turbo'] },
          anthropic: { enabled: false, apiKey: '', models: ['claude-3.5-sonnet'] },
          google: { enabled: false, apiKey: '', models: ['gemini-1.5-pro'] },
          inworld: { enabled: false, apiKey: '', models: ['npc-ai', 'dialogue-system'] },
        },
      },
      
      selectedModel: null,
      
      setAIModelConfig: (path, config) => set((state) => {
        // Handle nested paths like "code.openai" or simple paths like "openai"
        const parts = path.split('.');
        if (parts.length === 2) {
          const [category, provider] = parts;
          return {
            aiModels: {
              ...state.aiModels,
              [category]: {
                ...state.aiModels[category],
                [provider]: { ...state.aiModels[category]?.[provider], ...config }
              }
            }
          };
        } else {
          // Fallback for old structure
          return {
            aiModels: {
              ...state.aiModels,
              [path]: { ...state.aiModels[path], ...config }
            }
          };
        }
      }),
      
      setSelectedModel: (model) => set({ selectedModel: model }),
      
      // UI State
      sidebarOpen: true,
      theme: 'dark',
      
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setTheme: (theme) => set({ theme }),
      
      // Unity Integration
      unityConnected: false,
      unityEndpoint: 'http://localhost:8080',
      
      setUnityConnected: (connected) => set({ unityConnected: connected }),
      setUnityEndpoint: (endpoint) => set({ unityEndpoint: endpoint }),
}));

export default useStore;
