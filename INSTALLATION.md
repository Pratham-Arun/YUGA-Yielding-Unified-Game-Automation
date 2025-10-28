# 🎮 YUGA Engine - Installation & Setup

## System Requirements

- **OS**: Windows 10+, macOS 10.13+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 500MB for installation
- **Node.js**: v14.0.0 or higher

---

## Installation Steps

### 1️⃣ Install Node.js

**Windows:**
1. Visit https://nodejs.org/
2. Download LTS version
3. Run installer and follow prompts
4. Verify installation:
```bash
node --version
npm --version
```

**macOS:**
```bash
brew install node
```

**Linux (Ubuntu):**
```bash
sudo apt update
sudo apt install nodejs npm
```

---

### 2️⃣ Clone/Download YUGA Engine

```bash
cd c:\Users\Pratham arun\source\repos\YUGA
```

Or download the ZIP and extract it.

---

### 3️⃣ Install Dependencies

```bash
npm install
```

This installs:
- Electron (desktop framework)
- Three.js (3D rendering)
- Tailwind CSS (styling)
- All other dependencies

**Installation time**: 2-5 minutes depending on internet speed

---

### 4️⃣ Run YUGA Engine

**Development Mode:**
```bash
npm run dev
```

This will:
1. Start a local web server on `http://localhost:3000`
2. Launch the Electron app automatically
3. Open DevTools for debugging

**Production Mode:**
```bash
npm start
```

---

## Building Standalone Installers

### Windows Installer

```bash
npm run build-win
```

Creates:
- `dist/YUGA Engine Setup 1.0.0.exe` - Full installer
- `dist/YUGA Engine 1.0.0.exe` - Portable executable

**Installation size**: ~150MB

### macOS App

```bash
npm run build-mac
```

Creates:
- `dist/YUGA Engine-1.0.0.dmg` - Disk image
- `dist/YUGA Engine-1.0.0.zip` - Compressed app

**Installation size**: ~120MB

### Linux AppImage

```bash
npm run build-linux
```

Creates:
- `dist/YUGA Engine-1.0.0.AppImage` - Standalone executable
- `dist/yuga-engine_1.0.0_amd64.deb` - Debian package

**Installation size**: ~100MB

---

## Troubleshooting

### Issue: `npm: command not found`
**Solution**: Node.js not installed. Download from https://nodejs.org/

### Issue: `npm install` fails
**Solution**: 
```bash
npm cache clean --force
npm install
```

### Issue: App won't start
**Solution**:
```bash
npm run dev
```
Check console for error messages.

### Issue: Port 3000 already in use
**Solution**: Change port in `package.json` or kill process using port 3000.

### Issue: Three.js not loading
**Solution**: Wait a few seconds, then refresh. Check browser console (F12).

---

## Uninstallation

### Windows
1. Go to **Settings → Apps → Apps & features**
2. Find **YUGA Engine**
3. Click **Uninstall**

### macOS
1. Open **Finder**
2. Go to **Applications**
3. Drag **YUGA Engine** to **Trash**

### Linux
```bash
sudo apt remove yuga-engine
```

---

## Updating YUGA Engine

### From Development
```bash
git pull origin main
npm install
npm run dev
```

### From Installed App
1. Download latest installer
2. Run installer (it will update existing installation)
3. Launch YUGA Engine

---

## Getting Started

After installation:

1. **Launch YUGA Engine**
   - Windows: Click desktop shortcut or Start menu
   - macOS: Open Applications → YUGA Engine
   - Linux: Run `YUGA Engine-1.0.0.AppImage`

2. **Create First Project**
   - Click "New Project"
   - Enter project name
   - Select template
   - Click "Create"

3. **Explore the Interface**
   - Left: Scene Hierarchy
   - Center: 3D Viewport
   - Right: Inspector
   - Bottom: Console

4. **Read Documentation**
   - See `QUICKSTART.md` for quick tutorial
   - See `README.md` for full documentation

---

## System Paths

### Project Files Location
- **Windows**: `C:\Users\[YourUsername]\AppData\Local\YUGA Engine`
- **macOS**: `~/Library/Application Support/YUGA Engine`
- **Linux**: `~/.config/YUGA Engine`

### Project Save Format
- Extension: `.yuga`
- Format: JSON
- Location: User's chosen directory

---

## Performance Tips

1. **Close unnecessary apps** to free up RAM
2. **Use SSD** for faster loading
3. **Update graphics drivers** for better 3D performance
4. **Disable auto-save** if experiencing lag (File → Settings)
5. **Reduce viewport resolution** for older computers

---

## Next Steps

✅ Installation complete!

1. Read `QUICKSTART.md` for first project tutorial
2. Explore example projects
3. Check `README.md` for full feature list
4. Start building your game!

---

## Support

- **Documentation**: See `README.md`
- **Quick Start**: See `QUICKSTART.md`
- **Setup Guide**: See `SETUP.md`
- **Issues**: Check GitHub issues

---

**Welcome to YUGA Engine! 🎮✨**

*Yielding Unified Game Automation*
