/* eslint-disable @typescript-eslint/no-explicit-any */
import { SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Icon from "./icon";
import { useTheme } from "next-themes";

export default function SidebarMenuExtensionItemWrapper({
  icon,
  title,
  link,
  activeId,
  onLinkPress,
}: {
  icon: string;
  title: string;
  link: string;
  activeId: string;
  onLinkPress?: () => void;
}) {
  const { theme } = useTheme();
  console.log("Rendering SidebarMenuExtensionItemWrapper for ", theme);
  return (
    <SidebarMenuItem
      onClick={(e) => {
        onLinkPress && onLinkPress();
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`relative ${
        activeId === link.split("/").pop() ? "bg-accent hover:bg-accent/30" : ""
      }`}
      style={{ WebkitAppRegion: "no-drag" } as any}
    >
      {/* This wrapper prevents the Sidebar from breaking */}
      <div
        className={`

            relative flex items-center h-11 
            overflow-hidden 
            transition-all duration-300
            `}
      >
        {/* Absolute content inside wrapper */}
        <Link
          href={link}
          className="
                absolute inset-0 flex items-center gap-3
                hover:bg-accent hover:text-accent-foreground"
        >
          {/* Icon stays fixed size → no shifting */}
          <Icon
            src={icon}
            className="shrink-0 mx-3"
            themeColor={(theme as "dark" | "light" | undefined) ?? "light"}
          />
          
        </Link>
                    {activeId === link.split('/').pop() && (
                    <div
                        className="
                        absolute left-0 top-1/2 -translate-y-1/2
                        w-1 h-8 bg-gray-700 dark:bg-white rounded-r-full
                        animate-in slide-in-from-left-2 duration-300
                        "
                    />
                )}
        </div>
        </SidebarMenuItem>
    );
}
