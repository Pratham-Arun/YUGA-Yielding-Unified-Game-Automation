/**
 * Tauri Helper Functions
 * Provides unified API for file operations, dialogs, and window management
 * Works in both web and desktop environments
 */

// Check if running in Tauri environment
export const isTauri = () => {
  return typeof window !== 'undefined' && window.__TAURI__ !== undefined;
};

// File System Operations
export const fileSystem = {
  /**
   * Read a text file
   * @param {string} path - File path
   * @returns {Promise<string>} File contents
   */
  async readTextFile(path) {
    if (isTauri()) {
      const { readTextFile } = await import('@tauri-apps/api/fs');
      return await readTextFile(path);
    } else {
      // Fallback for web: use File API or fetch
      throw new Error('File system access not available in web mode');
    }
  },

  /**
   * Write a text file
   * @param {string} path - File path
   * @param {string} contents - File contents
   */
  async writeTextFile(path, contents) {
    if (isTauri()) {
      const { writeTextFile } = await import('@tauri-apps/api/fs');
      await writeTextFile(path, contents);
    } else {
      throw new Error('File system access not available in web mode');
    }
  },

  /**
   * Read a binary file
   * @param {string} path - File path
   * @returns {Promise<Uint8Array>} File contents
   */
  async readBinaryFile(path) {
    if (isTauri()) {
      const { readBinaryFile } = await import('@tauri-apps/api/fs');
      return await readBinaryFile(path);
    } else {
      throw new Error('File system access not available in web mode');
    }
  },

  /**
   * Write a binary file
   * @param {string} path - File path
   * @param {Uint8Array} contents - File contents
   */
  async writeBinaryFile(path, contents) {
    if (isTauri()) {
      const { writeBinaryFile } = await import('@tauri-apps/api/fs');
      await writeBinaryFile(path, contents);
    } else {
      throw new Error('File system access not available in web mode');
    }
  },

  /**
   * Check if file exists
   * @param {string} path - File path
   * @returns {Promise<boolean>}
   */
  async exists(path) {
    if (isTauri()) {
      const { exists } = await import('@tauri-apps/api/fs');
      return await exists(path);
    } else {
      return false;
    }
  },

  /**
   * Create directory
   * @param {string} path - Directory path
   * @param {boolean} recursive - Create parent directories
   */
  async createDir(path, recursive = true) {
    if (isTauri()) {
      const { createDir } = await import('@tauri-apps/api/fs');
      await createDir(path, { recursive });
    } else {
      throw new Error('File system access not available in web mode');
    }
  },

  /**
   * Remove file
   * @param {string} path - File path
   */
  async removeFile(path) {
    if (isTauri()) {
      const { removeFile } = await import('@tauri-apps/api/fs');
      await removeFile(path);
    } else {
      throw new Error('File system access not available in web mode');
    }
  },

  /**
   * Read directory contents
   * @param {string} path - Directory path
   * @returns {Promise<Array>} Directory entries
   */
  async readDir(path) {
    if (isTauri()) {
      const { readDir } = await import('@tauri-apps/api/fs');
      return await readDir(path);
    } else {
      throw new Error('File system access not available in web mode');
    }
  }
};

// Dialog Operations
export const dialog = {
  /**
   * Show open file dialog
   * @param {Object} options - Dialog options
   * @returns {Promise<string|string[]|null>} Selected file path(s)
   */
  async open(options = {}) {
    if (isTauri()) {
      const { open } = await import('@tauri-apps/api/dialog');
      return await open(options);
    } else {
      // Fallback: use HTML file input
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = options.multiple || false;
        input.accept = options.filters?.map(f => f.extensions.map(e => `.${e}`).join(',')).join(',') || '*';
        
        input.onchange = (e) => {
          const files = Array.from(e.target.files);
          if (options.multiple) {
            resolve(files.map(f => f.name));
          } else {
            resolve(files[0]?.name || null);
          }
        };
        
        input.click();
      });
    }
  },

  /**
   * Show save file dialog
   * @param {Object} options - Dialog options
   * @returns {Promise<string|null>} Selected file path
   */
  async save(options = {}) {
    if (isTauri()) {
      const { save } = await import('@tauri-apps/api/dialog');
      return await save(options);
    } else {
      // Fallback: prompt for filename
      return prompt('Enter filename:', options.defaultPath || 'untitled');
    }
  },

  /**
   * Show message dialog
   * @param {string} message - Message to display
   * @param {Object} options - Dialog options
   */
  async message(message, options = {}) {
    if (isTauri()) {
      const { message: showMessage } = await import('@tauri-apps/api/dialog');
      await showMessage(message, options);
    } else {
      alert(message);
    }
  },

  /**
   * Show confirmation dialog
   * @param {string} message - Message to display
   * @param {Object} options - Dialog options
   * @returns {Promise<boolean>} User's choice
   */
  async confirm(message, options = {}) {
    if (isTauri()) {
      const { confirm } = await import('@tauri-apps/api/dialog');
      return await confirm(message, options);
    } else {
      return window.confirm(message);
    }
  }
};

// Window Management
export const windowManager = {
  /**
   * Get current window
   * @returns {Object} Window instance
   */
  async getCurrent() {
    if (isTauri()) {
      const { appWindow } = await import('@tauri-apps/api/window');
      return appWindow;
    } else {
      return window;
    }
  },

  /**
   * Set window title
   * @param {string} title - New title
   */
  async setTitle(title) {
    if (isTauri()) {
      const { appWindow } = await import('@tauri-apps/api/window');
      await appWindow.setTitle(title);
    } else {
      document.title = title;
    }
  },

  /**
   * Maximize window
   */
  async maximize() {
    if (isTauri()) {
      const { appWindow } = await import('@tauri-apps/api/window');
      await appWindow.maximize();
    } else {
      console.warn('Maximize not available in web mode');
    }
  },

  /**
   * Minimize window
   */
  async minimize() {
    if (isTauri()) {
      const { appWindow } = await import('@tauri-apps/api/window');
      await appWindow.minimize();
    } else {
      console.warn('Minimize not available in web mode');
    }
  },

  /**
   * Toggle fullscreen
   */
  async toggleFullscreen() {
    if (isTauri()) {
      const { appWindow } = await import('@tauri-apps/api/window');
      const isFullscreen = await appWindow.isFullscreen();
      await appWindow.setFullscreen(!isFullscreen);
    } else {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  },

  /**
   * Close window
   */
  async close() {
    if (isTauri()) {
      const { appWindow } = await import('@tauri-apps/api/window');
      await appWindow.close();
    } else {
      window.close();
    }
  }
};

// Path utilities
export const path = {
  /**
   * Get application data directory
   * @returns {Promise<string>} App data path
   */
  async appDataDir() {
    if (isTauri()) {
      const { appDataDir } = await import('@tauri-apps/api/path');
      return await appDataDir();
    } else {
      return '/app-data';
    }
  },

  /**
   * Get documents directory
   * @returns {Promise<string>} Documents path
   */
  async documentDir() {
    if (isTauri()) {
      const { documentDir } = await import('@tauri-apps/api/path');
      return await documentDir();
    } else {
      return '/documents';
    }
  },

  /**
   * Get downloads directory
   * @returns {Promise<string>} Downloads path
   */
  async downloadDir() {
    if (isTauri()) {
      const { downloadDir } = await import('@tauri-apps/api/path');
      return await downloadDir();
    } else {
      return '/downloads';
    }
  },

  /**
   * Join path segments
   * @param {...string} segments - Path segments
   * @returns {Promise<string>} Joined path
   */
  async join(...segments) {
    if (isTauri()) {
      const { join } = await import('@tauri-apps/api/path');
      return await join(...segments);
    } else {
      return segments.join('/');
    }
  }
};

// Shell operations
export const shell = {
  /**
   * Open URL in default browser
   * @param {string} url - URL to open
   */
  async open(url) {
    if (isTauri()) {
      const { open } = await import('@tauri-apps/api/shell');
      await open(url);
    } else {
      window.open(url, '_blank');
    }
  }
};

export default {
  isTauri,
  fileSystem,
  dialog,
  windowManager,
  path,
  shell
};
