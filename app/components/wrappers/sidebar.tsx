"use client";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Settings, ShoppingBag, Users } from "lucide-react";
import SidebarMenuItemWrapper from "../wrappers_sub_components/sidebar_menu_item";
import { ThemeTogglerButton } from "@/components/animate-ui/components/buttons/theme-toggler";
import SidebarProfileComponent from "../wrappers_sub_components/sidebar_profile_component";
import { useEffect, useState } from "react";
import SidebarMenuExtensionItemWrapper from "../wrappers_sub_components/sidebar_extension";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useExtensionsManager } from "@/contexts/ExtensionManagerContext";
import LoadingSpinner from "@/components/costume/loading_spinner";

export default function SideBar() {
  const [activeExtensionId, setActiveExtensionId] = useState<string | null>(
    "/"
  );
  const { readExtensions, loadExtensionsList, getExtensionsLoadingState } =
    useExtensionsManager();
  const { user } = useAuth();

  const fetchUserExtensions = async () => {
    await loadExtensionsList();
  };

  useEffect(() => {
    fetchUserExtensions();
  }, []);

  const quickActionOptions = [
    {title: "PROFILE_PLACE_HOLDER", icon: null},
    { title: "SOCIALS", icon: Users },
    { title: "STORE", icon: ShoppingBag },
  ];

  // Sidebar UI
  return (
    <Sidebar
      collapsible="icon"
      className="w-13! left-0 overflow-x-hidden pt-0 flex justify-between 
      border-r! border-gray-300 dark:border-gray-700"
    >
      <SidebarContent className="overflow-x-hidden pt-4  gap-0">
        {/* --------- Main Components ---------- */}
        {quickActionOptions.map((action, index) => {
          if (index == 0) {
            return (
              <Link
                onClick={(e) => {
                  setActiveExtensionId("/")
                }}
                href={"/home"} className="relative">
                <SidebarProfileComponent src={user?.photoURL} />
                {activeExtensionId === "/" && (
                  <div
                    key={index}
                      className="
                      absolute left-0 top-1/2 -translate-y-1/2
                      w-1 h-8 bg-gray-700 dark:bg-white rounded-r-full
                      animate-in slide-in-from-left-2 duration-300
                      "
                  />
              )}
              </Link>
            );
          } else {
            return (
              <SidebarMenuItemWrapper
                key={action.title}
                onClick={() => {
                  setActiveExtensionId(action.title);
                }}
                Icon={action.icon!}
                activeId={activeExtensionId!}
                href={action.title}
              />
            );
          }
        })}
        <SidebarSeparator className="border dark:border-gray-700 border-gray-200 mx-0! shadow-none" />

        {/* ------------ Extensions ---------- */}
        {getExtensionsLoadingState() ? (
          <div className="h-full w-full flex items-start pt-4 justify-center">
            <LoadingSpinner size="w-7 h-7" />
          </div>
        ) : (
          <div>
            {readExtensions().map((ext, index) => (
              <SidebarMenuExtensionItemWrapper
                key={ext.id + index}
                activeId={activeExtensionId!}
                onClick={() => {
                  setActiveExtensionId(ext.id);
                }}
                icon={`/extensions/${ext.id}/icon.svg`}
                title={ext.manifest.name}
                link={`/extensions/${ext.id}`}
              />
            ))}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="p-0! m-0!">
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeTogglerButton
              modes={["dark", "light"]}
              className="bg-sidebar! text-primary shadow-none rounded-none p-2 
            hover:bg-accent! transition-all duration-200 w-full border-t dark:border-gray-700 border-gray-200"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
