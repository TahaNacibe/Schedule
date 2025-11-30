'use client';
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Maximize, Minus, X } from "lucide-react";

export default function CustomTitleBar() {
  const handleWindow = (action: 'minimize' | 'maximize' | 'close') => {
    console.log('[REACT] Sending action:', action);
    window.electronAPI?.controlWindow(action);
  };

  // Side bar
  const {
    state,
  } = useSidebar()

  return (
    <div className=" z-10 w-full flex justify-end absolute" style={{ WebkitAppRegion: 'drag' } as any} >
      <div className="flex justify-end pl-12 w-full">
        <div className="flex" style={{ WebkitAppRegion: 'no-drag' } as any}>
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
