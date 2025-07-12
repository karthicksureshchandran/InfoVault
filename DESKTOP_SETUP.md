# InfoVault Desktop Setup Guide

## How to Use InfoVault

### Getting Started
1. **Navigation**: Use the sidebar to navigate between:
   - **Dashboard**: Main view showing items in selected project
   - **Projects**: Manage all your projects
   - **Search**: Find items across all projects
   - **Settings**: Export/import data and view app info

2. **Creating Projects**:
   - Click the "+" button in the Projects section of sidebar
   - Or go to Projects page and click "New Project"
   - Give it a name and description

3. **Adding Items**:
   - Select a project from the sidebar first
   - Click "Add Item" in the Dashboard
   - Choose item type: URL, Image, Video, Document, Code, Note, Reference, Archive
   - Fill in the details:
     - **Name**: What you want to call this item
     - **Description**: What this item is about
     - **Source**: URL or file path
     - **Tags**: Keywords for searching (comma-separated)

4. **Managing Items**:
   - **Edit**: Click the edit icon on any item card
   - **Delete**: Click the trash icon on any item card
   - **Open**: Click the action button (Open/Preview/Play) to access the item

5. **Search & Filter**:
   - Use the search bar to find items by name, description, or tags
   - Use filters to narrow by item type or date range
   - Sort by name, date, or type

6. **Export/Import**:
   - Go to Settings to export your data as CSV or JSON
   - Import previously exported JSON files to restore data

## Converting to Desktop Application

### Quick Method: Use Our Build Script ⚡

The easiest way to create a .exe file:

```bash
# Build Windows executable
node build-exe.js
```

This will create `InfoVault Setup.exe` in the `release` folder that you can install and distribute.

**See BUILD_EXE_GUIDE.md for detailed step-by-step instructions.**

### Manual Method: Electron Setup

#### Step 1: Install Electron
```bash
# Install Electron as a development dependency
npm install --save-dev electron

# Install additional dependencies for packaging
npm install --save-dev electron-builder
```

#### Step 2: Create Electron Main Process
Create `electron/main.js`:

```javascript
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.png'), // Add your app icon
    show: false,
    titleBarStyle: 'default'
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-project');
          }
        },
        {
          label: 'New Item',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            mainWindow.webContents.send('menu-new-item');
          }
        },
        { type: 'separator' },
        {
          label: 'Export Data',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-export');
          }
        },
        {
          label: 'Import Data',
          accelerator: 'CmdOrCtrl+I',
          click: () => {
            mainWindow.webContents.send('menu-import');
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'actualSize' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About InfoVault',
          click: () => {
            mainWindow.webContents.send('menu-about');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

#### Step 3: Update package.json
Add these scripts and configuration:

```json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron-dev": "NODE_ENV=development electron .",
    "dist": "npm run build && electron-builder",
    "dist-all": "npm run build && electron-builder -mwl",
    "pack": "npm run build && electron-builder --dir"
  },
  "build": {
    "appId": "com.infovault.app",
    "productName": "InfoVault",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "server/**/*",
      "package.json",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.productivity",
      "target": "dmg"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

#### Step 4: Create Build Script
Create `build-desktop.sh`:

```bash
#!/bin/bash

echo "Building InfoVault Desktop Application..."

# Install dependencies
npm install

# Build the frontend
npm run build

# Package for current platform
npm run pack

echo "Desktop application built successfully!"
echo "Check the 'release' folder for the packaged app."
```

### Option 2: Tauri (Rust-based, smaller size)

#### Step 1: Install Tauri CLI
```bash
npm install --save-dev @tauri-apps/cli
```

#### Step 2: Initialize Tauri
```bash
npx tauri init
```

#### Step 3: Configure Tauri
Update `src-tauri/tauri.conf.json`:

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:5000",
    "distDir": "../dist"
  },
  "package": {
    "productName": "InfoVault",
    "version": "1.0.0"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "all": false,
        "open": true
      }
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 900,
        "resizable": true,
        "title": "InfoVault",
        "width": 1400,
        "minHeight": 700,
        "minWidth": 1200
      }
    ]
  }
}
```

### Option 3: PWA (Progressive Web App)

#### Step 1: Create Service Worker
Create `public/sw.js`:

```javascript
const CACHE_NAME = 'infovault-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

#### Step 2: Create Manifest
Create `public/manifest.json`:

```json
{
  "short_name": "InfoVault",
  "name": "InfoVault - Personal Repository Manager",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#000000",
  "background_color": "#ffffff"
}
```

## Building Executables

### For Windows (.exe)
```bash
# Using Electron
npm run dist -- --win

# Using Tauri
npm run tauri build -- --target x86_64-pc-windows-msvc
```

### For macOS (.app/.dmg)
```bash
# Using Electron
npm run dist -- --mac

# Using Tauri
npm run tauri build -- --target x86_64-apple-darwin
```

### For Linux (.AppImage)
```bash
# Using Electron
npm run dist -- --linux

# Using Tauri
npm run tauri build -- --target x86_64-unknown-linux-gnu
```

## Data Storage

### Current Setup (SQLite Database) ✅
- **Built-in SQLite database** using better-sqlite3
- **Data location**: `~/.infovault/infovault.db` (user's home directory)
- **Features**: 
  - Persistent storage (data survives restarts)
  - Full database performance with indexes
  - No external database server required
  - Automatic backup-friendly (single file)
  - Perfect for desktop applications

### Database Features ✅
- **Projects table**: Stores project information
- **Items table**: Stores all items with full metadata
- **Indexes**: Optimized for fast searching by project, type, and name
- **Foreign keys**: Ensures data integrity (deleting project removes its items)
- **JSON storage**: Tags and metadata stored as JSON for flexibility

## Features Summary

✅ **Completed Features:**
- Project-based organization
- Multiple item types (URL, Image, Video, Document, Code, Note, Reference, Archive)
- Advanced search and filtering
- Sort by name, date, type
- Export to CSV/JSON
- Import from JSON
- Responsive design
- Dark mode support
- Thumbnail previews for images/videos
- Tag-based categorization
- Random inspirational quotes
- About dialog

🚀 **Ready for Desktop Deployment:**
- All core functionality working
- Responsive UI suitable for desktop
- No cloud dependencies
- Local data storage
- Cross-platform compatible

## Next Steps

1. Choose your preferred desktop framework (Electron recommended for ease)
2. Follow the setup guide above
3. Test the application thoroughly
4. Build executables for your target platforms
5. Distribute or install locally

Your InfoVault application is now ready to become a full desktop application!