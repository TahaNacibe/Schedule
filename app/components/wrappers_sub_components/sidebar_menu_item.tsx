import { SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";

export default function SidebarMenuItemWrapper({
    Icon,
    title,
    isOpen,
    onClick,
}: {
    Icon: any;
    title: string;
        isOpen: boolean;
    onClick?: () => void;
}) {
    return (
        <SidebarMenuItem
            onClick={(e) => {
                onClick && onClick();
                e.preventDefault();
                e.stopPropagation();
            }}
            className="relative py-0! my-0!"
            style={{ WebkitAppRegion: 'no-drag' } as any}>
        {/* This wrapper prevents the Sidebar from breaking */}
        <div
            className={`
            relative flex items-center h-9.5
            overflow-hidden 
            transition-all duration-300
            `}
        >
            {/* Absolute content inside wrapper */}
            <Link
            href={`/${title.toLowerCase()}`}
            className="
                absolute inset-0 flex items-center gap-3 px-3.5
                hover:bg-accent hover:text-accent-foreground
            "
            >
            {/* Icon stays fixed size → no shifting */}
            <Icon size={21} className="shrink-0" />

            {/* Text reveals only when open */}
            <span
                className={`
                transition-opacity duration-200
                ${isOpen ? "opacity-100" : "opacity-0"}
                whitespace-nowrap
                `}
            >
                {title}
            </span>
            </Link>
        </div>
        </SidebarMenuItem>
    );
}
