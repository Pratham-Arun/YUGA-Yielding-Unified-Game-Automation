# 🎮 YUGA Engine - Build & Distribution Checklist

## Pre-Build Checklist

- [ ] All dependencies installed: `npm install`
- [ ] Code tested in development: `npm run dev`
- [ ] No console errors or warnings
- [ ] All features working as expected
- [ ] Documentation updated
- [ ] Version number updated in `package.json`
- [ ] Changelog updated
- [ ] License file present
- [ ] README.md complete

---

## Building for Windows

### Prerequisites
- [ ] Windows 10 or later
- [ ] Node.js installed
- [ ] All dependencies installed

### Build Steps
```bash
npm run build-win
```

### Output Files
- [ ] `dist/YUGA Engine Setup 1.0.0.exe` - Installer
- [ ] `dist/YUGA Engine 1.0.0.exe` - Portable executable

### Testing
- [ ] Run installer on clean Windows machine
- [ ] Test portable executable
- [ ] Verify all features work
- [ ] Check file associations
- [ ] Test uninstall process

### Distribution
- [ ] Upload to website
- [ ] Create GitHub release
- [ ] Update download links
- [ ] Announce release

---

## Building for macOS

### Prerequisites
- [ ] macOS 10.13 or later
- [ ] Node.js installed
- [ ] All dependencies installed
- [ ] Apple Developer account (for signing)

### Build Steps
```bash
npm run build-mac
```

### Output Files
- [ ] `dist/YUGA Engine-1.0.0.dmg` - Disk image
- [ ] `dist/YUGA Engine-1.0.0.zip` - Compressed app

### Testing
- [ ] Run on Intel Mac
- [ ] Run on Apple Silicon Mac
- [ ] Test all features
- [ ] Verify code signing
- [ ] Test notarization

### Distribution
- [ ] Upload to website
- [ ] Create GitHub release
- [ ] Submit to Mac App Store (optional)

---

## Building for Linux

### Prerequisites
- [ ] Linux (Ubuntu 18.04+)
- [ ] Node.js installed
- [ ] All dependencies installed

### Build Steps
```bash
npm run build-linux
```

### Output Files
- [ ] `dist/YUGA Engine-1.0.0.AppImage` - Standalone executable
- [ ] `dist/yuga-engine_1.0.0_amd64.deb` - Debian package

### Testing
- [ ] Test AppImage on Ubuntu
- [ ] Test Debian package installation
- [ ] Test on other Linux distributions
- [ ] Verify all features work

### Distribution
- [ ] Upload to website
- [ ] Create GitHub release
- [ ] Submit to Flathub (optional)
- [ ] Submit to Snap Store (optional)

---

## Post-Build Checklist

### Quality Assurance
- [ ] All installers tested
- [ ] No missing files
- [ ] File sizes reasonable
- [ ] Installation time acceptable
- [ ] Uninstall works cleanly

### Documentation
- [ ] Installation guide updated
- [ ] Release notes written
- [ ] Changelog updated
- [ ] Known issues documented
- [ ] Troubleshooting guide updated

### Release
- [ ] Version tagged in Git
- [ ] GitHub release created
- [ ] Release notes published
- [ ] Download links updated
- [ ] Social media announcement

### Monitoring
- [ ] Monitor download stats
- [ ] Track bug reports
- [ ] Collect user feedback
- [ ] Plan next release

---

## Version Numbering

Use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

Example: `1.0.0` → `1.1.0` → `1.1.1` → `2.0.0`

---

## Release Notes Template

```markdown
# YUGA Engine v1.0.0

## New Features
- Feature 1
- Feature 2
- Feature 3

## Improvements
- Improvement 1
- Improvement 2

## Bug Fixes
- Bug fix 1
- Bug fix 2

## Known Issues
- Known issue 1
- Known issue 2

## Installation
- Windows: Download `YUGA Engine Setup 1.0.0.exe`
- macOS: Download `YUGA Engine-1.0.0.dmg`
- Linux: Download `YUGA Engine-1.0.0.AppImage`

## Changelog
See CHANGELOG.md for full history.
```

---

## Troubleshooting Build Issues

### Issue: Build fails with "out of memory"
**Solution**: Increase Node.js memory
```bash
node --max-old-space-size=4096 node_modules/.bin/electron-builder
```

### Issue: Code signing fails (macOS)
**Solution**: Ensure Apple Developer certificate is installed
```bash
security find-identity -v -p codesigning
```

### Issue: AppImage won't run (Linux)
**Solution**: Make executable
```bash
chmod +x dist/YUGA\ Engine-1.0.0.AppImage
```

### Issue: Installer is too large
**Solution**: Remove unnecessary files from `package.json` build section

### Issue: Build takes too long
**Solution**: 
- Close other applications
- Use SSD for faster I/O
- Increase available RAM

---

## Continuous Integration (Optional)

### GitHub Actions Setup
Create `.github/workflows/build.yml`:

```yaml
name: Build YUGA Engine

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - uses: softprops/action-gh-release@v1
        with:
          files: dist/**/*
```

---

## Distribution Channels

### Official Website
- [ ] Create download page
- [ ] Host installers
- [ ] Provide installation instructions
- [ ] Link to documentation

### GitHub Releases
- [ ] Create release
- [ ] Upload installers
- [ ] Write release notes
- [ ] Mark as latest

### Package Managers
- [ ] Chocolatey (Windows)
- [ ] Homebrew (macOS)
- [ ] Snap Store (Linux)
- [ ] Flathub (Linux)

### Social Media
- [ ] Twitter announcement
- [ ] Reddit post
- [ ] Discord announcement
- [ ] LinkedIn post

---

## Post-Release

### Monitor
- [ ] Download statistics
- [ ] User feedback
- [ ] Bug reports
- [ ] Feature requests

### Support
- [ ] Respond to issues
- [ ] Fix critical bugs
- [ ] Plan next release
- [ ] Update documentation

### Maintenance
- [ ] Security updates
- [ ] Dependency updates
- [ ] Performance improvements
- [ ] Feature additions

---

## Checklist Summary

**Before Build:**
- [ ] Code tested
- [ ] Documentation updated
- [ ] Version bumped

**During Build:**
- [ ] Windows build successful
- [ ] macOS build successful
- [ ] Linux build successful

**After Build:**
- [ ] All installers tested
- [ ] Release notes written
- [ ] GitHub release created
- [ ] Announcement posted

**Post-Release:**
- [ ] Monitor downloads
- [ ] Collect feedback
- [ ] Plan next release

---

## Quick Build Commands

```bash
# Install dependencies
npm install

# Test in development
npm run dev

# Build all platforms
npm run build

# Build Windows only
npm run build-win

# Build macOS only
npm run build-mac

# Build Linux only
npm run build-linux
```

---

## Support Resources

- **Electron Builder Docs**: https://www.electron.build/
- **Electron Docs**: https://www.electronjs.org/docs
- **GitHub Releases**: https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases
- **Semantic Versioning**: https://semver.org/

---

**Ready to Release! 🚀**

*YUGA Engine - Yielding Unified Game Automation*
