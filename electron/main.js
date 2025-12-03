const path = require('path');
require('dotenv').config({ 
  path: path.join(__dirname, '..', '.env.local'),
  debug: true  
});

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const cloudinary = require('cloudinary').v2;
const isDev = require('electron-is-dev');
const AdmZip = require('adm-zip');
const { pipeline } = require('stream');
const { promisify } = require('util');
const urlModule = require('url'); 
const fs = require('fs');
let win;
const extensionsDir = path.join(app.getPath('userData'), 'extensions');



//* Extension related setup
//Ex: Make sure folder exists
if (!fs.existsSync(extensionsDir)) {
  fs.mkdirSync(extensionsDir, { recursive: true });
}


//* Electron app settings
function createWindow() {
  win = new BrowserWindow({
    height: 550,
    width: 820,
    minHeight: 550,
    minWidth: 820,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../out/index.html')}`
  );
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on('window-control', (event, action) => {
  console.log('[MAIN] Window action:', action);
  if (!win) return;

  if (action === 'minimize') win.minimize();
  else if (action === 'maximize') win.isMaximized() ? win.unmaximize() : win.maximize();
  else if (action === 'close') win.close();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



//* handle extensions download and unzipping
ipcMain.handle('install-extension', async (event, url) => {
  try {
    console.log('Downloaded extension from:', url);

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || (!contentType.includes('zip') && !contentType.includes('binary'))) {
      throw new Error(`Not a ZIP/binary file! Got: ${contentType}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract to a temporary folder first
    const tempDir = path.join(extensionsDir, 'temp_extract');
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });

    const tempZip = path.join(extensionsDir, 'temp.zip');
    fs.writeFileSync(tempZip, buffer);

    const zip = new AdmZip(tempZip);
    zip.extractAllTo(tempDir, true);
    
    fs.unlinkSync(tempZip);

    // Read manifest.json from the extracted temp folder
    const manifestPath = path.join(tempDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error('manifest.json not found in the extension ZIP');
    }

    const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    const extId = manifestData.id;
    if (!extId) {
      throw new Error('No "id" field found in manifest.json');
    }

    // Create final folder using the ID from manifest
    const finalPrivateDir = path.join(extensionsDir, extId);

    // If extension already exists, remove it first (rewrite)
    if (fs.existsSync(finalPrivateDir)) {
      fs.rmSync(finalPrivateDir, { recursive: true, force: true });
      console.log(`Overwriting existing extension: ${extId}`);
    }

    // Move extracted temp to final private dir
    fs.renameSync(tempDir, finalPrivateDir);

    // Copy to public for renderer access
    const publicExtDir = path.join(__dirname, '../public/extensions');
    if (!fs.existsSync(publicExtDir)) fs.mkdirSync(publicExtDir, { recursive: true });
    const publicTarget = path.join(publicExtDir, extId);
    if (fs.existsSync(publicTarget)) fs.rmSync(publicTarget, { recursive: true });
    fs.cpSync(finalPrivateDir, publicTarget, { recursive: true });

    console.log(`Installed/updated extension with ID: ${extId} from ${url}`);
    return { success: true, id: extId, name: manifestData.name || extId };
  } catch (error) {
    console.error('Install error:', error);
    // Clean up temp on error
    const tempDir = path.join(extensionsDir, 'temp_extract');
    if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
    const tempZip = path.join(extensionsDir, 'temp.zip');
    if (fs.existsSync(tempZip)) fs.unlinkSync(tempZip);
    return { success: false, error: error.message };
  }
});

//* handle extensions uninstall
ipcMain.handle('uninstall-extension', async (event, extId) => {
  try {
    console.log(`Uninstalling extension with ID: ${extId}`);

    // Remove from private extensions directory
    const privateExtPath = path.join(extensionsDir, extId);
    if (fs.existsSync(privateExtPath)) {
      fs.rmSync(privateExtPath, { recursive: true, force: true });
      console.log(`Removed private dir: ${privateExtPath}`);
    } else {
      throw new Error(`Extension directory not found: ${privateExtPath}`);
    }

    // Remove from public extensions directory (for renderer access)
    const publicExtDir = path.join(__dirname, '../public/extensions');
    const publicExtPath = path.join(publicExtDir, extId);
    if (fs.existsSync(publicExtPath)) {
      fs.rmSync(publicExtPath, { recursive: true, force: true });
      console.log(`Removed public dir: ${publicExtPath}`);
    }

    console.log(`Uninstalled extension: ${extId}`);
    return { success: true, id: extId };
  } catch (error) {
    console.error('Uninstall error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-extensions', async () => {
  try {
    // in case no extensions exist
    if (!fs.existsSync(extensionsDir)) { 
      return [];
    }

    // otherwise we load all extensions and there manifest file content
    const extFolders = fs.readdirSync(extensionsDir)
    const extensions = []

    console.log(`Reading extensions from: ${extFolders}`);  // Debug log
    for (const folder of extFolders) {
      console.log("in folder:", folder);
      const manifestPath = path.join(extensionsDir, folder, 'manifest.json');
      console.log("Checking manifest at:", manifestPath);
      if (fs.existsSync(manifestPath)) { 
        console.log("Found manifest at:", manifestPath);
        const manifestData = fs.readFileSync(manifestPath, "utf8")
        const manifest = JSON.parse(manifestData);
        extensions.push({
          id: folder, 
          rootPath: path.join(extensionsDir, folder),
          manifest: manifest  
        });
      }
    }

  console.log(`Found ${extensions.length} extensions`);  // Debug log
    return extensions;
  } catch (error) {
    console.error('List error:', error);
    return [];
  }
})



// image upload
ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', "jpeg"] }],
  });
  return result.canceled ? null : result.filePaths[0];
});


ipcMain.handle('upload-file', async (event, filePath,ext_id) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: `/schedule/${ext_id}/uploads` });
  return result.secure_url; 
});