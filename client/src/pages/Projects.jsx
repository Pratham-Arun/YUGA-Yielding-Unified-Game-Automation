import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, Trash2, Edit, Search } from 'lucide-react';
import useStore from '../store/useStore';
import axios from 'axios';

const Projects = () => {
  const { projects, setProjects, deleteProject } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    const newProject = {
      id: `project_${Date.now()}`,
      name: newProjectName,
      data: {
        scenes: [],
        scripts: [],
        assets: [],
        aiTasks: [],
      },
    };

    try {
      await axios.post('/api/projects', newProject);
      await loadProjects();
      setNewProjectName('');
      setShowNewProjectModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`/api/projects/${id}`);
      deleteProject(id);
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Projects</h1>
          <p className="text-slate-400">Manage your game development projects</p>
        </div>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="gradient-btn px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="glass rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <FolderKanban className="w-20 h-20 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p className="text-slate-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="gradient-btn px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="glass rounded-2xl p-6 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
              <p className="text-sm text-slate-400 mb-4">
                Updated {new Date(project.updated_at).toLocaleDateString()}
              </p>
              
              <Link
                to={`/projects/${project.id}`}
                className="block w-full py-2 px-4 bg-indigo-600/20 hover:bg-indigo-600/30 rounded-lg text-center font-medium transition-colors"
              >
                Open Project
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-dark rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                className="flex-1 gradient-btn py-3 px-4 rounded-lg font-medium"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
