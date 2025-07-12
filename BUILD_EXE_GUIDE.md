# How to Create InfoVault.exe

Follow these simple steps to build InfoVault as a Windows executable (.exe):

## Prerequisites
- Windows 10/11 (for building Windows .exe)
- Node.js 18+ installed
- Git (optional, if downloading from repository)

## Step 1: Prepare the Project
```bash
# If you haven't already, install dependencies
npm install

# Make sure the application works
npm run dev
```

## Step 2: Build the Frontend
```bash
# Navigate to client folder and build
cd client
npm run build
cd ..
```

## Step 3: Create the Desktop Application
```bash
# Run the desktop build script
node build-exe.js
```

This script will:
- ✅ Build the frontend assets
- ✅ Prepare all necessary files
- ✅ Install dependencies for the desktop app
- ✅ Create a Windows installer (.exe)

## Step 4: Find Your Executable
After the build completes successfully, you'll find:
- **InfoVault Setup.exe** in the `release` folder
- This is the installer that users can run to install InfoVault

## Step 5: Install and Test
1. Double-click `InfoVault Setup.exe`
2. Follow the installation wizard
3. InfoVault will be installed and can be launched from:
   - Desktop shortcut
   - Start Menu
   - Applications folder

## What Gets Installed
The desktop version includes:
- ✅ Complete InfoVault application
- ✅ Built-in SQLite database (stores data in user's home folder)
- ✅ All dependencies bundled
- ✅ No internet required after installation
- ✅ Automatic updates (if configured)

## Database Location
User data is stored at: `C:\Users\[Username]\.infovault\infovault.db`

## Troubleshooting

### Build Fails
```bash
# Clean and try again
rm -rf dist dist-desktop release node_modules
npm install
node build-exe.js
```

### App Won't Start
- Check Windows Defender isn't blocking the app
- Run as Administrator if needed
- Ensure Windows 10/11 (older versions may not work)

### Database Issues
- Make sure user has write permissions to home directory
- Check `%USERPROFILE%\.infovault\` folder exists and is writable

## Alternative: Portable Version
For a portable version that doesn't require installation:
```bash
# Build without installer
npx electron-builder --dir --win
```

This creates a folder with the executable that can be copied anywhere.

## Distribution
To share InfoVault with others:
1. Give them the `InfoVault Setup.exe` file
2. They run it to install
3. No additional setup required - everything is included!

---

Your InfoVault desktop application is now ready for use offline with persistent storage!