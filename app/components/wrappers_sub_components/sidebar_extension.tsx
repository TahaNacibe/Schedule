/* eslint-disable @typescript-eslint/no-explicit-any */
import { SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Icon from "./icon";
import { useTheme } from "next-themes";

export default function SidebarMenuExtensionItemWrapper({
<<<<<<< HEAD:app/components/wrappers_sub_components/sidebar_extenstion.tsx
  icon,
  title,
  link,
  isOpen,
  activeId,
  onClick,
}: {
  icon: string;
  title: string;
  link: string;
  isOpen: boolean;
  activeId: string;
  onClick?: () => void;
}) {
  const { theme } = useTheme();
  console.log("Rendering SidebarMenuExtensionItemWrapper for ", theme);
  return (
    <SidebarMenuItem
      onClick={(e) => {
        onClick && onClick();
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
=======
    icon,
    title,
    link,
    activeId,
    onClick,
}: {
    icon: string;
    title: string;
    link: string;
    activeId: string;
    onClick?: () => void;
    }) {
    
    const { theme } = useTheme()
    return (
        <SidebarMenuItem
            onClick={(e) => {
                onClick && onClick();
                e.preventDefault();
                e.stopPropagation();
            }}
            className={`relative ${activeId === link.split('/').pop() ? 'bg-accent hover:bg-accent/40' : ''}`}
            style={{ WebkitAppRegion: 'no-drag' } as any}>
        {/* This wrapper prevents the Sidebar from breaking */}
        <div
            className={`
>>>>>>> 67780029c704ef471467d5a3463929b44e8bdf38:app/components/wrappers_sub_components/sidebar_extension.tsx
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
                hover:bg-accent hover:text-accent-foreground
            "
<<<<<<< HEAD:app/components/wrappers_sub_components/sidebar_extenstion.tsx
        >
          {/* Icon stays fixed size → no shifting */}
          <Icon
            src={icon}
            className="shrink-0 mx-3"
            themeColor={(theme as "dark" | "light" | undefined) ?? "light"}
          />
=======
            >
            {/* Icon stays fixed size → no shifting */}
            <Icon src={icon} className="shrink-0 mx-3.5" themeColor={theme as ("dark" | "light" | undefined) ?? "light"} />
>>>>>>> 67780029c704ef471467d5a3463929b44e8bdf38:app/components/wrappers_sub_components/sidebar_extension.tsx

          {/* Text reveals only when open */}
          <span
            className={`
                transition-opacity duration-200
                opacity-0
                whitespace-nowrap
                `}
<<<<<<< HEAD:app/components/wrappers_sub_components/sidebar_extenstion.tsx
          >
            {title}
          </span>
        </Link>
      </div>
    </SidebarMenuItem>
  );
=======
            >
                {title}
            </span>
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
>>>>>>> 67780029c704ef471467d5a3463929b44e8bdf38:app/components/wrappers_sub_components/sidebar_extension.tsx
}
