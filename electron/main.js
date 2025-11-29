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
    width: 1024,
    height: 768,
    minHeight: 550,
    minWidth: 1024,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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

    const tempZip = path.join(extensionsDir, 'temp.zip');
    fs.writeFileSync(tempZip, buffer);

    // FIXED: Clean extName from pathname only 
    const parsedUrl = new urlModule.URL(url);
    const pathname = parsedUrl.pathname;
    const extName = path.basename(pathname, '.zip') || 'unknown-ext';

    const zip = new AdmZip(tempZip);
    zip.extractAllTo(path.join(extensionsDir, extName), true);
    
    fs.unlinkSync(tempZip);
    // copy to public for renderer access
    const publicExtDir = path.join(__dirname, '../public/extensions');
    if (!fs.existsSync(publicExtDir)) fs.mkdirSync(publicExtDir, { recursive: true });
    const publicTarget = path.join(publicExtDir, extName);
    if (fs.existsSync(publicTarget)) fs.rmSync(publicTarget, { recursive: true });
    fs.cpSync(path.join(extensionsDir, extName), publicTarget, { recursive: true });

    console.log(`Copied to public: ${extName}`);

    console.log(`Installed: ${extName}`);
    return { success: true, name: extName };
  } catch (error) {
    console.error('Install error:', error);
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
    filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
  });
  return result.canceled ? null : result.filePaths[0];
});


ipcMain.handle('upload-file', async (event, filePath,ext_id) => {
  const result = await cloudinary.uploader.upload(filePath, { folder: `/schedule/${ext_id}/uploads` });
  return result.secure_url; 
});