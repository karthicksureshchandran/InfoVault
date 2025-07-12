#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building InfoVault Desktop Application (.exe)...\n');

try {
  // Step 1: Create folders
  fs.mkdirSync('dist-desktop/electron', { recursive: true });
  fs.mkdirSync('dist-desktop/resources', { recursive: true });
  fs.mkdirSync('dist-desktop/server', { recursive: true });
  fs.mkdirSync('dist-desktop/shared', { recursive: true });

  // Step 2: Copy electron main file
  fs.copyFileSync('electron/main.js', 'dist-desktop/electron/main.js');

  // Step 3: Copy backend folders (skip frontend for now)
  fs.cpSync('server', 'dist-desktop/server', { recursive: true });
  fs.cpSync('shared', 'dist-desktop/shared', { recursive: true });

  // Step 4: Create minimal package.json
  const packageJson = {
    name: "infovault-desktop",
    version: "1.0.0",
    description: "InfoVault Desktop App",
    author: "InfoVault",
    main: "electron/main.js",
    dependencies: {
      "better-sqlite3": "^11.8.0",
      "express": "^4.21.2"
      "electron": "^26.2.0"
    }
  };
  fs.writeFileSync('dist-desktop/package.json', JSON.stringify(packageJson, null, 2));

  // Step 5: Install deps
  execSync('npm install', { stdio: 'inherit', cwd: 'dist-desktop' });

  // Step 6: Build .exe (skip icons)
  const builderConfig = {
    appId: "com.infovault.app",
    productName: "InfoVault",
    directories: {
      output: "../release"
    },
    files: ["**/*", "!**/node_modules/**/*", "**/node_modules/better-sqlite3/**/*"],
    win: {
      target: [{ target: "nsis", arch: ["x64"] }]
    },
    nsis: {
      oneClick: false,
      allowToChangeInstallationDirectory: true,
      createDesktopShortcut: true,
      createStartMenuShortcut: true
    }
  };
  fs.writeFileSync('dist-desktop/electron-builder.json', JSON.stringify(builderConfig, null, 2));

  execSync('npx electron-builder --config electron-builder.json --win', {
    stdio: 'inherit',
    cwd: 'dist-desktop'
  });

  console.log('\n🎉 SUCCESS! Your .exe file is in the "release" folder.');

} catch (err) {
  console.error('\n❌ Build failed:', err.message);
  process.exit(1);
}
