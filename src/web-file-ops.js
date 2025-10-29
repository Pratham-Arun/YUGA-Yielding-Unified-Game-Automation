// Web-based file operations to replace Electron IPC
export const fileOperations = {
  async saveProject(projectData) {
    if (!projectData || typeof projectData.name !== 'string') {
      return { success: false, error: 'Invalid project data. "name" is required.' };
    }

    try {
      const dataStr = JSON.stringify(projectData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${projectData.name}.yuga`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, path: `${projectData.name}.yuga` };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async loadProject() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.yuga,application/json';
      input.style.display = 'none';
      
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const parsed = JSON.parse(e.target.result);
              resolve({ success: true, data: parsed, path: file.name });
            } catch (err) {
              resolve({ success: false, error: 'Failed to parse project file: ' + String(err) });
            }
          };
          reader.readAsText(file);
        } else {
          resolve({ success: false });
        }
        document.body.removeChild(input);
      };
      
      document.body.appendChild(input);
      input.click();
    });
  },

  async exportGame(format) {
    const allowed = { webgl: 'html', exe: 'exe' };
    const ext = allowed[format] || 'html';
    
    try {
      // Create a simple export file
      const exportData = {
        type: 'yuga-export',
        format: format,
        timestamp: new Date().toISOString(),
        message: 'This is a placeholder export. In a full implementation, this would contain your game build.'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `game-export.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return { success: true, path: `game-export.${ext}` };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  },

  async getAppVersion() {
    return { success: true, version: '1.0.0' };
  }
};

// Expose file operations globally for compatibility
window.fileOperations = fileOperations;
