#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building InfoVault Desktop Application (.exe)...\n');

try {
  // Step 1: Create directories
  console.log('📁 Creating build directories...');
  if (!fs.existsSync('dist-desktop')) {
    fs.mkdirSync('dist-desktop', { recursive: true });
  }
  if (!fs.existsSync('dist-desktop/resources')) {
    fs.mkdirSync('dist-desktop/resources', { recursive: true });
  }

  // Step 2: Build frontend
  console.log('📦 Building frontend (this may take a moment)...');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: './client' 
  });
  console.log('✅ Frontend built successfully\n');

  // Step 3: Copy files for desktop app
  console.log('📋 Preparing desktop application files...');
  
  // Copy electron main file
  if (!fs.existsSync('dist-desktop/electron')) {
    fs.mkdirSync('dist-desktop/electron', { recursive: true });
  }
  fs.copyFileSync('electron/main.js', 'dist-desktop/electron/main.js');
  
  // Copy built frontend to resources
  if (fs.existsSync('dist')) {
    fs.cpSync('dist', 'dist-desktop/resources/dist', { recursive: true });
  }
  
  // Copy server files
  if (!fs.existsSync('dist-desktop/server')) {
    fs.mkdirSync('dist-desktop/server', { recursive: true });
  }
  fs.cpSync('server', 'dist-desktop/server', { recursive: true });
  fs.cpSync('shared', 'dist-desktop/shared', { recursive: true });
  
  // Create package.json for desktop app
  const packageJson = {
    "name": "infovault-desktop",
    "version": "1.0.0",
    "description": "InfoVault - Personal Repository Manager",
    "main": "electron/main.js",
    "author": "InfoVault",
    "license": "MIT",
    "dependencies": {
      "better-sqlite3": "^11.8.0",
      "express": "^4.21.2",
      "tsx": "^4.19.2"
    }
  };
  
  fs.writeFileSync('dist-desktop/package.json', JSON.stringify(packageJson, null, 2));
  console.log('✅ Files prepared successfully\n');

  // Step 4: Install dependencies in dist-desktop
  console.log('📦 Installing dependencies for desktop app...');
  execSync('npm install', { 
    stdio: 'inherit',
    cwd: 'dist-desktop' 
  });
  console.log('✅ Dependencies installed\n');

  // Step 5: Build executable
  console.log('⚡ Building Windows executable (.exe)...');
  console.log('This will create a Windows installer and executable...\n');

  const builderConfig = {
    "appId": "com.infovault.app",
    "productName": "InfoVault",
    "directories": {
      "output": "../release"
    },
    "files": [
      "**/*",
      "!**/node_modules/**/*",
      "**/node_modules/better-sqlite3/**/*"
    ],
    "win": {
      "target": [
        {
          "target": "nsis",
          "arch": ["x64"]
        }
      ]
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "installerIcon": "build/icon.ico",
      "uninstallerIcon": "build/icon.ico"
    }
  };

  fs.writeFileSync('dist-desktop/electron-builder.json', JSON.stringify(builderConfig, null, 2));

  // Run electron-builder
  execSync('npx electron-builder --config electron-builder.json --win', { 
    stdio: 'inherit',
    cwd: 'dist-desktop' 
  });

  console.log('\n🎉 SUCCESS! InfoVault Desktop Application built!');
  console.log('📁 Your .exe file is in the "release" folder');
  console.log('💡 You can now install and run InfoVault as a standalone desktop application');
  
} catch (error) {
  console.error('\n❌ Build failed:', error.message);
  console.log('\n🔍 Troubleshooting tips:');
  console.log('1. Make sure all dependencies are installed: npm install');
  console.log('2. Ensure you have Node.js 18+ installed');
  console.log('3. Check that the client build works: cd client && npm run build');
  console.log('4. Try running the build again');
  process.exit(1);
}
