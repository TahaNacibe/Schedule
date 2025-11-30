import { SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Icon from "./icon";
import { useTheme } from "next-themes";

export default function SidebarMenuExtensionItemWrapper({
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
            >
            {/* Icon stays fixed size → no shifting */}
            <Icon src={icon} className="shrink-0 mx-3.5" themeColor={theme as ("dark" | "light" | undefined) ?? "light"} />

            {/* Text reveals only when open */}
            <span
                className={`
                transition-opacity duration-200
                opacity-0
                whitespace-nowrap
                `}
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
}
