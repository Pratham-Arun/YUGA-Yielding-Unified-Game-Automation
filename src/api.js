const API_BASE = (typeof window !== 'undefined' && window.location) ? `${window.location.protocol}//${window.location.hostname}:4000` : 'http://localhost:4000';

async function ping() {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: 'no-store' });
    return res.ok;
  } catch {
    return false;
  }
}

export const backend = {
  API_BASE,
  async isAvailable() { return await ping(); },
  async listProjects() {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error('Failed to list projects');
    return await res.json();
  },
  async getProject(id) {
    const res = await fetch(`${API_BASE}/api/projects/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Project not found');
    return await res.json();
  },
  async upsertProject({ id, name, data }) {
    const res = await fetch(`${API_BASE}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, data })
    });
    if (!res.ok) throw new Error('Failed to save project');
    return await res.json();
  },
  async deleteProject(id) {
    const res = await fetch(`${API_BASE}/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
    return await res.json();
  }
};


