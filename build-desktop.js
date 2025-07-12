const { build } = require('vite');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function buildDesktop() {
  console.log('🔨 Building InfoVault Desktop Application...\n');

  try {
    // Step 1: Build the frontend
    console.log('📦 Building frontend...');
    await build({
      root: './client',
      build: {
        outDir: '../dist',
        emptyOutDir: true
      }
    });
    console.log('✅ Frontend built successfully\n');

    // Step 2: Build the backend
    console.log('🛠️  Building backend...');
    const esbuild = require('esbuild');
    
    await esbuild.build({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      outfile: 'dist-server/index.js',
      external: ['better-sqlite3'],
      format: 'cjs',
      sourcemap: false,
      minify: true
    });
    console.log('✅ Backend built successfully\n');

    // Step 3: Copy necessary files
    console.log('📋 Copying files...');
    
    // Copy package.json with production dependencies only
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const prodPackageJson = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      main: 'electron/main.js',
      dependencies: {
        'better-sqlite3': packageJson.dependencies['better-sqlite3']
      }
    };
    
    fs.writeFileSync('dist-desktop/package.json', JSON.stringify(prodPackageJson, null, 2));
    
    // Copy electron files
    if (!fs.existsSync('dist-desktop/electron')) {
      fs.mkdirSync('dist-desktop/electron', { recursive: true });
    }
    fs.copyFileSync('electron/main.js', 'dist-desktop/electron/main.js');
    
    // Copy built frontend
    if (!fs.existsSync('dist-desktop/dist')) {
      fs.mkdirSync('dist-desktop/dist', { recursive: true });
    }
    fs.cpSync('dist', 'dist-desktop/dist', { recursive: true });
    
    // Copy built backend
    if (!fs.existsSync('dist-desktop/server')) {
      fs.mkdirSync('dist-desktop/server', { recursive: true });
    }
    fs.copyFileSync('dist-server/index.js', 'dist-desktop/server/index.js');
    
    console.log('✅ Files copied successfully\n');

    // Step 4: Build Electron app
    console.log('⚡ Building Electron application...');
    
    const builder = require('electron-builder');
    
    await builder.build({
      projectDir: 'dist-desktop',
      config: {
        appId: 'com.infovault.app',
        productName: 'InfoVault',
        directories: {
          output: '../release'
        },
        files: [
          '**/*',
          '!node_modules/**/*',
          'node_modules/better-sqlite3/**/*'
        ],
        win: {
          target: 'nsis',
          icon: 'assets/icon.ico' // Add your icon here
        },
        mac: {
          target: 'dmg',
          icon: 'assets/icon.icns'
        },
        linux: {
          target: 'AppImage',
          icon: 'assets/icon.png'
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          createDesktopShortcut: true,
          createStartMenuShortcut: true
        }
      }
    });

    console.log('🎉 InfoVault Desktop Application built successfully!');
    console.log('📁 Check the "release" folder for your executable files.');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildDesktop();