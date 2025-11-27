"use client";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  useSidebar,
  SidebarSeparator,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Home, Settings, ShoppingBag } from "lucide-react";
import SidebarMenuItemWrapper from "../wrappers_sub_components/sidebar_menu_item";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import SidebarProfileComponent from "../wrappers_sub_components/sidebar_profile_component";
import { useAppAPI } from "@/contexts/AppAPI";
import { useEffect, useState } from "react";
import SidebarMenuExtensionItemWrapper from "../wrappers_sub_components/sidebar_extenstion";

export default function SideBar() {
  // Sidebar state
  const [isLoadingExtensions, setIsLoadingExtensions] = useState(false);
  const [activeExtensionId, setActiveExtensionId] = useState<string | null>("Home-001");
  const [error, setError] = useState<string | null>(null);
  const { state } = useSidebar();
  const { readExtensions, updateExtensions } = useAppAPI();
  
  // Load extensions on mount (if needed)
  const handleRead = async () => {
    //Ex: start loading
    setIsLoadingExtensions(true);

    // check electronAPI availability
    if (window.electronAPI) {
      const extensionsList = await window.electronAPI.readExtensions();
      // update context
      if (extensionsList && extensionsList.length > 0) {
        setActiveExtensionId(extensionsList[0].id);
        updateExtensions(extensionsList);
          console.log("updated extensions in context");
          setIsLoadingExtensions(false);
      } else {
        setIsLoadingExtensions(false);
        setError('No extensions found');
      }
      // Ex: end loading
    } else {
      setIsLoadingExtensions(false);
      console.log('Electron API not ready (dev mode?)');
      setError('Electron API not ready (dev mode?)');
    }
  };

  useEffect(() => {
    handleRead();
  },[])

  // Sidebar UI
  return (
    <Sidebar
      collapsible="icon"
      className="w-[calc(35vh-32px)] left-0 overflow-x-hidden pt-0 flex justify-between 
      bg-background!
      border-r-2! border-dashed border-gray-300 dark:border-gray-600"
    >
      
      <SidebarContent className="overflow-x-hidden bg-background! gap-0">
        {/* --------- Main Components ---------- */}
        <SidebarMenuItemWrapper
          onClick={() => {
            setActiveExtensionId("Settings-001")
          }}
          Icon={Settings}
          title={"Settings"}
          isOpen={state == "expanded"}
        />
        <SidebarMenuItemWrapper
          onClick={() => {
            setActiveExtensionId("Shopping-001")
          }}
          Icon={ShoppingBag}
          title={"Shopping"}
          isOpen={state == "expanded"}
        />
        <SidebarMenuItemWrapper
          onClick={() => {
            setActiveExtensionId("Home-001")
          }}
          Icon={Home}
          title={"Home"}
          isOpen={state == "expanded"}
        />

         <SidebarProfileComponent isOpen={state == "expanded"} />
        <SidebarSeparator className="border dark:border-gray-600 border-gray-200 mx-0! shadow-none" />

        {/* ------------ Extensions ---------- */}
      {isLoadingExtensions
          ? (
          <p className="p-4">Loading extensions... { error ?? error }</p>)
          : <div>
            {readExtensions().map((ext, index) => (
                <SidebarMenuExtensionItemWrapper
                key={ext.id + index}
                activeId={activeExtensionId!}
                onClick={() => {
                  console.log("set active extension to ", ext.id);
                  setActiveExtensionId(ext.id)
                }}
                  icon={`/extensions/${ext.id}/icon.svg`} title={ext.manifest.name}
                  link={`/extensions/${ext.id}`} isOpen={state == "expanded"} />
          ))}
          </div>}
      </SidebarContent>
      <SidebarFooter className="bg-background!">
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeTogglerButton
            modes={["dark","light"]}
            className="bg-background! text-primary shadow-none rounded-none p-2 
            hover:bg-gray-200/50 transition-all duration-200" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
