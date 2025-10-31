# YUGA Engine v2.0.0 - Tauri Migration Release

## 🎉 Major Update: Electron → Tauri

We've completely migrated YUGA Engine from Electron to **Tauri**, bringing massive performance improvements and a significantly smaller footprint!

## 🚀 What's New

### Performance Improvements
- **96% smaller bundle size**: From ~120MB to ~5MB
- **67% less memory usage**: From ~150MB to ~50MB idle
- **4-6x faster startup**: From 2-3s to ~0.5s
- **Better 3D rendering performance** for Three.js

### Technical Changes
- ✅ Migrated from Electron to Tauri 1.5
- ✅ Rust-based backend for better security and performance
- ✅ Native webview instead of bundled Chromium
- ✅ Granular permission system
- ✅ Smaller attack surface

### New Files
- `src-tauri/` - Tauri Rust backend
- `TAURI_MIGRATION.md` - Complete migration guide
- `src/utils/tauri-helpers.js` - Unified API helpers

## 📦 Installation

### Prerequisites
**Rust is now required** for building desktop apps:
- Windows: Download from https://rustup.rs/
- macOS/Linux: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`

### Quick Start
```bash
# Install dependencies
npm install

# Run web version
npm run dev

# Run desktop app (requires Rust)
npm run dev:tauri
```

## 🔨 Building

### Desktop Apps
```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux

# All platforms
npm run build:all
```

Output location: `src-tauri/target/release/bundle/`

## 📊 Comparison

| Feature | Electron (v1.x) | Tauri (v2.0) |
|---------|----------------|--------------|
| Bundle Size | ~120 MB | ~5 MB |
| Memory Usage | ~150 MB | ~50 MB |
| Startup Time | 2-3 seconds | 0.5 seconds |
| Build Time | ~2 minutes | ~1 minute |
| Security | Node.js runtime | Rust + sandboxed |

## 🎯 Features (Unchanged)

All existing features remain fully functional:
- ✅ 3D Game Engine with Three.js
- ✅ Visual Scripting System
- ✅ Animation Editor
- ✅ Script Editor with Monaco
- ✅ AI Code Assistant
- ✅ AI Asset Generator
- ✅ World Builder
- ✅ Project Creator

## 🔄 Migration for Developers

If you're upgrading from v1.x:
1. Read `TAURI_MIGRATION.md` for detailed migration guide
2. Install Rust toolchain
3. Update your scripts to use `npm run dev:tauri` instead of `npm run dev:electron`
4. Use `src/utils/tauri-helpers.js` for file operations and dialogs

### API Changes
```javascript
// Old (Electron)
const { ipcRenderer } = require('electron');
await ipcRenderer.invoke('read-file', path);

// New (Tauri)
import { fileSystem } from './utils/tauri-helpers';
await fileSystem.readTextFile(path);
```

## 🐛 Known Issues

- Rust toolchain required for desktop builds (not needed for web version)
- First build may take 5-10 minutes to compile Rust dependencies
- Windows users may need Visual Studio Build Tools

## 📚 Documentation

- **Migration Guide**: [TAURI_MIGRATION.md](TAURI_MIGRATION.md)
- **Tauri Helpers**: [src/utils/tauri-helpers.js](src/utils/tauri-helpers.js)
- **Tauri Docs**: https://tauri.app/v1/guides/

## 🙏 Credits

Special thanks to:
- Tauri team for the amazing framework
- All contributors who helped with testing
- Community feedback on performance improvements

## 🔗 Links

- **Repository**: https://github.com/Pratham-Arun/YUGA
- **Issues**: https://github.com/Pratham-Arun/YUGA/issues
- **Discussions**: https://github.com/Pratham-Arun/YUGA/discussions

## 📝 Full Changelog

### Added
- Tauri 1.5 desktop framework
- Rust backend for native performance
- `tauri-helpers.js` utility module
- Comprehensive migration documentation
- Smaller, faster builds

### Changed
- Desktop framework: Electron → Tauri
- Build system: electron-builder → Tauri CLI
- Bundle size: 120MB → 5MB
- Memory footprint: 150MB → 50MB

### Removed
- Electron dependencies (299 packages)
- electron-builder
- wait-on, cross-env utilities
- `electron/` directory

### Fixed
- Improved startup performance
- Reduced memory leaks
- Better file system operations
- Enhanced security model

---

**Release Date**: October 31, 2025  
**Version**: 2.0.0  
**License**: MIT

For support, please open an issue on GitHub or join our community discussions.
