"use client";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ShoppingBag } from "lucide-react";
import SidebarMenuItemWrapper from "../wrappers_sub_components/sidebar_menu_item";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import SidebarProfileComponent from "../wrappers_sub_components/sidebar_profile_component";
import { useEffect, useRef, useState } from "react";
import SidebarMenuExtensionItemWrapper from "../wrappers_sub_components/sidebar_extension";
import Link from "next/link";
import { useExtensionsManager } from "@/contexts/ExtensionManagerContext";
import LoadingSpinner from "@/components/costume/loading_spinner";
import { useProfile } from "@/contexts/ProfileContext";
import ExtensionsStore from "../extenstions_store";

export default function SideBar() {
  const [activeExtensionId, setActiveExtensionId] = useState<string | null>(
    "/"
  );
  const { extensions, loadExtensionsList, loading } =
    useExtensionsManager();
  const { userProfile } = useProfile()
  const didInit = useRef(false);

  const fetchUserExtensions = async () => {
    await loadExtensionsList();
  };

  useEffect(() => {
      if (!didInit.current) {
      didInit.current = true;
      fetchUserExtensions();
    }
  }, []);


  // Sidebar UI
  return (
    <Sidebar
      collapsible="icon"
      className="w-13! left-0 overflow-x-hidden pt-0 flex! justify-between 
      border-r! border-gray-300 dark:border-gray-700 sm:flex!"
    >
      {userProfile && <SidebarContent className="overflow-x-hidden pt-4  gap-0">
        {/* --------- Main Components ---------- */}
        <Link
                onClick={(e) => {
                  setActiveExtensionId("/")
                }}
                href={"/"} className="relative">
                <SidebarProfileComponent src={userProfile?.photo_URL} />
                {activeExtensionId === "/" && (
                  <div
                      className="
                      absolute left-0 top-1/2 -translate-y-1/2
                      w-1 h-8 bg-gray-700 dark:bg-white rounded-r-full
                      animate-in slide-in-from-left-2 duration-300
                      "
                  />
              )}
        </Link>
        <ExtensionsStore isActive={activeExtensionId === "store"} />
        <SidebarSeparator className="border dark:border-gray-700 border-gray-200 mx-0! shadow-none" />

        {/* ------------ Extensions ---------- */}
        {loading ? (
          <div className="h-full w-full flex items-start pt-4 justify-center">
            <LoadingSpinner size="w-7 h-7" />
          </div>
        ) : (
          <div>
            {extensions.map((ext, index) => (
              <SidebarMenuExtensionItemWrapper
                key={ext.id + index}
                title={ext.manifest.name}
                activeId={activeExtensionId!}
                onLinkPress={() => {
                  setActiveExtensionId(ext.id);
                }}
                icon={`/extensions/${ext.id}/icon.svg`}
                link={`/extensions/${ext.id}`}
              />
            ))}
          </div>
        )}
      </SidebarContent>}
      <SidebarFooter className="p-0! m-0! bottom-0 absolute left-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeTogglerButton
              modes={["light", "dark"]}
              className="bg-sidebar! text-primary shadow-none rounded-none p-2 
            hover:bg-accent! transition-all duration-200 w-full border-t dark:border-gray-700 border-gray-200"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
