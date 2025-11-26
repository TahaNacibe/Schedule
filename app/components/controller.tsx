'use client';
import { Maximize, Minus, X } from "lucide-react";

export default function CustomTitleBar() {
  const handleWindow = (action: 'minimize' | 'maximize' | 'close') => {
    console.log('[REACT] Sending action:', action);
    // @ts-ignore
    window.electronAPI?.controlWindow(action);
  };

  return (
    <div className="z-10 w-full flex justify-end" style={{ WebkitAppRegion: 'drag' } as any} >
      <div className="w-fit flex" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button 
        className="controller-button px-3.5 py-2 hover:bg-gray-200/50 transition-all duration-200"
        onClick={() => handleWindow('minimize')}>
          <Minus size={20} />
      </button>
        <button 
        className="controller-button px-3.5 py-2 hover:bg-gray-200/50 transition-all duration-200"
        onClick={() => handleWindow('maximize')}>
          <Maximize size={16} />
      </button>
        <button 
        className="controller-button px-3.5 py-2 hover:bg-red-500/70 hover:text-white transition-all duration-200"
        onClick={() => handleWindow('close')}>
          <X size={20} />
      </button>
      </div>
    </div>
  );
}
