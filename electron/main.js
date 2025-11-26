const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
let win;


function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minHeight: 550,
    minWidth: 512,
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