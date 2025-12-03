'use client';
import { Maximize, Minus, X } from "lucide-react";

export default function CustomTitleBar() {
  //? handle the action in electron API
  const handleWindow = (action: 'minimize' | 'maximize' | 'close') => {
    window.electronAPI?.controlWindow(action);
  };

  return (
    <div className=" z-40 w-full flex justify-end absolute" style={{ WebkitAppRegion: 'drag' } as any} >
      <div className="flex justify-end pl-12 w-full">
        <div className="flex backdrop-blur-md bg-accent/30 rounded-bl-lg" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {/* Controller buttons */}
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
    </div>
  );
}
