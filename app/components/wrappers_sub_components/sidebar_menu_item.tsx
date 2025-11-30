import { SidebarMenuItem } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function SidebarMenuItemWrapper({
    Icon,
    href,
    activeId,
    onClick,
}: {
    Icon: LucideIcon;
    href: string;
    activeId: string;
    onClick?: () => void;
    }) {
    const isActive = href === activeId
    const link = href.toLowerCase()
    return (
        <SidebarMenuItem
            onClick={(e) => {
                onClick && onClick();
                e.preventDefault();
                e.stopPropagation();
            }}
            className={`relative py-0! my-0! ${isActive ? 'bg-gray-600/10 hover:bg-accent/30' : ''}`}
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
            href={`/${link}`}
            className="
                absolute inset-0 flex items-center justify-center
                hover:bg-accent hover:text-accent-foreground
            "
            >
            {/* Icon stays fixed size → no shifting */}
                    <Icon size={25}
                        strokeWidth={isActive ? 2 : 1.5}
                        className={`shrink-0 transition-all duration-200`} />
                </Link>
        {/* Active indicator */}
        {isActive && (
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
