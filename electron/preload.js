const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electronAPI', {
    controlWindow: (action) => {
        console.log('[PRELOAD] Sending action:', action);
        ipcRenderer.send('window-control', action);
    },

    // extension control
    installExtension: (url) => ipcRenderer.invoke('install-extension', url),
    uninstallExtension: (id) => ipcRenderer.invoke("uninstall-extension", id),
    readExtensions: () => ipcRenderer.invoke("get-extensions"),

    // files
    selectFile: () => ipcRenderer.invoke('select-file'),
    uploadFile: (filePath, ext_id) => ipcRenderer.invoke('upload-file', filePath, ext_id),
});


// window api
window.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", (e) => {
        window.postMessage({
        type: "global-keydown",
        key: e.key,
        ctrl: e.ctrlKey,
        meta: e.metaKey
        });
    });
});
