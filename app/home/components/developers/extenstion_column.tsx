"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Edit2, File, MoreHorizontal, Trash } from "lucide-react"
import { ConfirmAction } from "../../dialogs/confirm_dialog"
import { ManifestDialog } from "../../dialogs/manifest_dialog"
import LoadingPinWheel from "@/components/costume/spinner_wheel"


export function ExtensionsColumns({
    onUpdate,
    onDelete,
    updateTarget,
    isLoading,
}: {
    onUpdate: (ext:Partial<ExtensionInstance>) => void,
        onDelete: (target_id: string) => void
        updateTarget: string | null
    isLoading?: boolean
}): ColumnDef<ExtensionInstance>[] {
    return [
        {
        accessorKey: "index",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Index
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium pl-8">{row.index + 1}</div>,
        },
        {
        accessorKey: "name",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Name
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
        },
        {
        accessorKey: "description",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Description
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="text-sm max-w-[200px] truncate">{row.getValue("description")}</div>,
        },
        {
        accessorKey: "version",
        header: "Version",
        cell: ({ row }) => <div className="text-sm">{row.getValue("version")}</div>,
        },
        {
        accessorKey: "url",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                URL
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
            )
        },
            cell: ({ row }) => <div className="text-sm max-w-[200px] truncate">
                <a href={row.getValue("url")} target="_blank" rel="noopener noreferrer" className=" hover:underline">{row.getValue("url")}</a></div>,
        },
        {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const manifest = row.original
            if (updateTarget && updateTarget == manifest.id) {
                return <LoadingPinWheel size="w-4! h-4!" />
            }

            return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <ConfirmAction
                    title="Delete Extension?"
                    description="This action cannot be undone. This will permanently delete the extension manifest."
                    onConfirm={() => onDelete(manifest.id)}
                    confirmText="Delete"
                    variant="destructive"
                >
                    <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="flex cursor-pointer items-center"
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Extension
                    </DropdownMenuItem>
                </ConfirmAction>
                <DropdownMenuSeparator />
                {/* display */}
                <ManifestDialog
                mode={"view"}
                ext={manifest}
                    trigger={
                    <DropdownMenuItem 
                        className="cursor-pointer"
                    >
                        <File className="mr-2 h-4 w-4" />
                        View manifest details
                    </DropdownMenuItem>
                    } />
                {/* edit */}
                <ManifestDialog
                mode={"edit"}
                ext={manifest}
                loading={isLoading}
                onSave={onUpdate}
                    trigger={
                <DropdownMenuItem 
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Extension
                </DropdownMenuItem>} />
                </DropdownMenuContent>
            </DropdownMenu>
            )
        },
        },
    ]
}