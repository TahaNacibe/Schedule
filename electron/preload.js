const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    controlWindow: (action) => {
        console.log('[PRELOAD] Sending action:', action);
        ipcRenderer.send('window-control', action);
    },
});