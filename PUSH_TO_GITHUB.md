# Push Tauri Migration to GitHub

## Quick Commands

```bash
# 1. Stage all changes
git add .

# 2. Commit with the prepared message
git commit -F COMMIT_MESSAGE.txt

# 3. Push to GitHub
git push origin main

# 4. Create a release tag
git tag -a v2.0.0 -m "YUGA Engine v2.0.0 - Tauri Migration"
git push origin v2.0.0
```

## Detailed Steps

### 1. Review Changes
```bash
git status
git diff
```

**Files Modified:**
- `.gitignore` - Added Tauri ignore patterns
- `README.md` - Updated with Tauri instructions
- `package.json` - Updated scripts and dependencies

**Files Added:**
- `src-tauri/` - Tauri Rust backend
- `TAURI_MIGRATION.md` - Migration guide
- `RELEASE_NOTES.md` - Release information
- `src/utils/tauri-helpers.js` - Helper utilities
- `.github/workflows/build-tauri.yml` - CI/CD workflow

**Files to Remove (Optional):**
- `electron/` directory (if exists)
- `README.md.backup`
- `COMMIT_MESSAGE.txt` (after committing)
- `PUSH_TO_GITHUB.md` (this file, after pushing)

### 2. Clean Up (Optional)
```bash
# Remove backup file
git rm README.md.backup

# Remove electron directory if it exists
git rm -r electron/
```

### 3. Stage Changes
```bash
# Stage all new and modified files
git add .

# Or stage specific files
git add .gitignore README.md package.json
git add src-tauri/
git add TAURI_MIGRATION.md RELEASE_NOTES.md
git add src/utils/tauri-helpers.js
git add .github/workflows/build-tauri.yml
```

### 4. Commit
```bash
# Use the prepared commit message
git commit -F COMMIT_MESSAGE.txt

# Or write your own
git commit -m "🚀 Migrate from Electron to Tauri v2.0.0"
```

### 5. Push to GitHub
```bash
# Push to main branch
git push origin main

# If you encounter issues, force push (use with caution)
git push -f origin main
```

### 6. Create Release Tag
```bash
# Create annotated tag
git tag -a v2.0.0 -m "YUGA Engine v2.0.0 - Tauri Migration Release"

# Push tag to GitHub
git push origin v2.0.0

# Or push all tags
git push --tags
```

### 7. Create GitHub Release

1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Select tag: `v2.0.0`
4. Release title: `YUGA Engine v2.0.0 - Tauri Migration`
5. Copy content from `RELEASE_NOTES.md` into description
6. Check "Set as the latest release"
7. Click "Publish release"

## Verify on GitHub

After pushing, verify:
- ✅ All files are uploaded
- ✅ README displays correctly
- ✅ GitHub Actions workflow runs (if configured)
- ✅ Release is created with proper notes

## Update Repository Settings

### Topics/Tags (Recommended)
Add these topics to your repository:
- `game-engine`
- `tauri`
- `rust`
- `react`
- `threejs`
- `game-development`
- `ai-powered`
- `visual-scripting`

### Description
Update repository description:
```
🎮 YUGA Engine - Next-gen game development engine with AI-powered tools. Built with Tauri, React, and Three.js. Features visual scripting, animation editor, and AI asset generation.
```

### Website
Add project website or demo link if available.

## Troubleshooting

### Large Files Warning
If you get warnings about large files:
```bash
# Check file sizes
git ls-files -s | awk '{print $4, $2}' | sort -n -r | head -20

# Use Git LFS for large files
git lfs track "*.png"
git lfs track "*.jpg"
```

### Merge Conflicts
If there are conflicts:
```bash
git pull origin main
# Resolve conflicts
git add .
git commit -m "Resolve merge conflicts"
git push origin main
```

### Authentication Issues
If you have authentication problems:
```bash
# Use GitHub CLI
gh auth login

# Or configure SSH
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add SSH key to GitHub
```

## Post-Push Checklist

- [ ] Verify all files on GitHub
- [ ] Check README renders correctly
- [ ] Create GitHub release with notes
- [ ] Update repository description and topics
- [ ] Test GitHub Actions workflow
- [ ] Share release announcement
- [ ] Update documentation links
- [ ] Close related issues

## Next Steps

1. **Install Rust** (if not already): https://rustup.rs/
2. **Test desktop build**: `npm run dev:tauri`
3. **Build release**: `npm run build:all`
4. **Share with community**: Post on social media, forums, etc.

---

**Note**: After successfully pushing, you can delete this file and `COMMIT_MESSAGE.txt`.
