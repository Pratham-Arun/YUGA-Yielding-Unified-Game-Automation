# YUGA Engine - Desktop Application Setup

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Navigate to project directory:**
```bash
cd c:\Users\Pratham arun\source\repos\YUGA
```

2. **Install dependencies:**
```bash
npm install
```

3. **Run in development mode:**
```bash
npm run dev
```

This will:
- Start a local web server on `http://localhost:3000`
- Launch the Electron app automatically
- Open DevTools for debugging

### Building for Distribution

**Windows:**
```bash
npm run build-win
```

**macOS:**
```bash
npm run build-mac
```

**Linux:**
```bash
npm run build-linux
```

**All platforms:**
```bash
npm run build
```

Built installers will be in the `dist/` directory.

---

## 📁 Project Structure

```
YUGA/
├── electron/
│   ├── main.js          # Electron main process
│   └── preload.js       # Secure IPC bridge
├── src/
│   ├── core/            # Engine core (Node, Scene, Component)
│   ├── views/           # UI views (Engine, Dashboard, etc.)
│   ├── ui/              # Layout components
│   ├── main.js          # App entry point
│   ├── router.js        # Client-side routing
│   └── state-enhanced.js # State management with Electron
├── assets/              # Icons and resources
├── index.html           # Main HTML file
├── package.json         # Dependencies and scripts
└── SETUP.md            # This file
```

---

## 🎮 Features

### Core Engine
- ✅ **3D Viewport** - Three.js powered rendering
- ✅ **Scene Hierarchy** - Godot-inspired node tree
- ✅ **Inspector Panel** - Real-time property editing
- ✅ **Asset Browser** - Visual asset management
- ✅ **Play/Pause/Stop** - Test games in real-time

### Development Tools
- ✅ **Script Editor** - Code editor with syntax highlighting
- ✅ **Animation Editor** - Timeline-based animations
- ✅ **Visual Scripting** - Node-based logic
- ✅ **AI Code Assistant** - Generate code from prompts
- ✅ **Asset Generator** - AI-powered asset creation

### Project Management
- ✅ **Save/Load Projects** - `.yuga` file format
- ✅ **Auto-Save** - Configurable auto-save intervals
- ✅ **Export Games** - WebGL, Windows, macOS, Linux
- ✅ **Project Templates** - Quick start templates

---

## 🔧 Development

### Hot Reload
Changes to source files will automatically reload the app during development.

### DevTools
Press `F12` or `Ctrl+Shift+I` to open Chrome DevTools for debugging.

### File Operations
The app uses Electron's secure IPC for file operations:
- Save projects to `.yuga` files
- Load projects from disk
- Export games to multiple formats

---

## 📦 Building Standalone Executable

### Windows Installer
```bash
npm run build-win
```
Creates:
- `YUGA Engine Setup 1.0.0.exe` - Installer
- `YUGA Engine 1.0.0.exe` - Portable executable

### macOS App
```bash
npm run build-mac
```
Creates:
- `YUGA Engine-1.0.0.dmg` - Disk image
- `YUGA Engine-1.0.0.zip` - Compressed app

### Linux AppImage
```bash
npm run build-linux
```
Creates:
- `YUGA Engine-1.0.0.AppImage` - Standalone executable
- `yuga-engine_1.0.0_amd64.deb` - Debian package

---

## 🎯 Next Steps

1. **Install dependencies:** `npm install`
2. **Run development:** `npm run dev`
3. **Build for distribution:** `npm run build`
4. **Share the installer** from `dist/` folder

---

## 📝 License

YUGA Engine is released under the **MIT License**.

See `LICENSE` file for details.

---

## 🤝 Support

For issues or questions:
1. Check the documentation
2. Review example projects
3. Check GitHub issues (when available)

---

**Happy Game Development! 🎮✨**
