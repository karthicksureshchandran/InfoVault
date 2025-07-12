# Quick Guide: Create InfoVault.exe

## Fastest Way to Build Windows Executable

### Step 1: Install Requirements
```bash
npm install electron electron-builder
```

### Step 2: Build Frontend 
```bash
cd client
npm run build
cd ..
```

### Step 3: Run Build Script
```bash
node build-exe.js
```

### Step 4: Get Your .exe
Find `InfoVault Setup.exe` in the `release/` folder!

---

## What You Get
- ✅ **InfoVault Setup.exe** - Windows installer 
- ✅ **Complete offline app** - No internet needed
- ✅ **Built-in SQLite database** - Data saved permanently
- ✅ **Desktop shortcuts** - Easy access from Start Menu/Desktop
- ✅ **Portable** - Can be installed on any Windows 10/11 PC

## Installation for End Users
1. Double-click `InfoVault Setup.exe`
2. Follow installation wizard
3. Launch InfoVault from desktop or Start Menu
4. Start organizing your digital assets!

## Database Location (Installed App)
User data automatically saved to: `C:\Users\[Username]\.infovault\infovault.db`

---

## Alternative: Test with Electron First
Want to test before building?
```bash
# Test the electron app locally
npm run electron-dev
```

This opens InfoVault in an Electron window to test desktop functionality.

---

Your InfoVault desktop app will be completely self-contained with no cloud dependencies!