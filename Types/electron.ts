
  interface Window {
    electronAPI?: {
      controlWindow: (action: 'minimize' | 'maximize' | 'close') => void;
      installExtension: (url: string) => { success: boolean, name?: string, error?: string };
      uninstallExtension: (id:string) => { success: boolean, name?: string, error?: string };
      readExtensions: () => [Extensions];
      selectFile: () => string;
      uploadFile: (filePath:string, ext_id:string) => string
    };
  }
