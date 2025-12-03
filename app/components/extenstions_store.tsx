import costumeToast from "@/components/costume/costume_toast";
import LoadingPinWheel from "@/components/costume/spinner_wheel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { useExtensionsManager } from "@/contexts/ExtensionManagerContext";
import { fetchSearchExtensionBasedOnQuery } from "@/services/extenstions_store";
import { Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";

export default function ExtensionsStore({ isActive }: { isActive: boolean }) {
    const [query, setQuery] = useState("")
    const [searchResult, setSearchResult] = useState<ExtensionInstance[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isWorkingOn, setIsWorkingOn] = useState<string | null>(null)
    const { extensions, setExtensions, loadExtensionsList } = useExtensionsManager()
    

    const getButtonState = (ext_id: string, ext_ver: string) => {
        const target = extensions.filter((ext) => ext.id == ext_id)
        if (!target || target.length === 0)
            return "NEW"

        if (target) {
            if (target[0].manifest.version != ext_ver) {
                return "UPDATE"
            } else {
                return "EXIST"
            }
        }
        return "NEW"
    }

    // handle action
    const handleAction = async (state: "NEW" | "UPDATE" | "EXIST", ext_id: string, ext_url: string) => {
        setIsWorkingOn(ext_id)
        let res;
        try {
            switch (state) {
                case "NEW":
                    // install 
                    res = await window.electronAPI?.installExtension(ext_url)
                    if (!res?.success) {
                        costumeToast({ content: res?.error, type: "ERROR" })
                        break;
                    }
                    // Reload list on success
                    await loadExtensionsList()
                    costumeToast({ content: `Extension "${res.name || ext_id}" installed successfully!`, type: "INFO" })
                    break;
                case "UPDATE":
                    // install again (reinstall)
                    res = await window.electronAPI?.installExtension(ext_url)
                    if (!res?.success) {
                        costumeToast({ content: res?.error, type: "ERROR" })
                        break;
                    }
                    // Reload list on success
                    await loadExtensionsList()
                    costumeToast({ content: `Extension "${res.name || ext_id}" updated successfully!`, type: "INFO" })
                    break;
                case "EXIST":
                    // remove
                    res = await window.electronAPI?.uninstallExtension(ext_id)
                    if (!res?.success) {
                        costumeToast({ content: res?.error, type: "ERROR" })
                        break;
                    }
                    // Reload list on success (instead of manual filter for consistency)
                    await loadExtensionsList()
                    costumeToast({ content: `Extension "${ext_id}" uninstalled successfully!`, type: "INFO" })
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error("Action error:", error)
            costumeToast({ content: "An unexpected error occurred.", type: "ERROR" })
        } finally {
            setIsWorkingOn(null)
        }
    }



    // handle search state
    const handleSearch = async (e: string) => {
        if (e.length === 0)
            setSearchResult([])

        setIsSearching(true)
        const res = await fetchSearchExtensionBasedOnQuery(e)
        if (!res.success) {
            setError(res.message)
            return;
        }
        
        setSearchResult(res.data as ExtensionInstance[])
        setIsSearching(false)
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <SidebarMenuItem
                    className={`relative py-0 my-0 ${isActive ? 'bg-gray-600/10 hover:bg-accent/30' : ''}`}
                    style={{ WebkitAppRegion: 'no-drag' } as any}>
                    <div
                        className={`
                            relative flex items-center h-11
                            overflow-hidden 
                            transition-all duration-300
                        `}
                    >
                        <div
                            className="
                                absolute inset-0 flex items-center justify-center
                                hover:bg-accent hover:text-accent-foreground
                            "
                        >
                            <ShoppingBag size={25}
                                strokeWidth={isActive ? 2 : 1.5}
                                className={`shrink-0 transition-all duration-200`} />
                        </div>
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
            </SheetTrigger>
            <SheetContent side="left" className="z-8 pl-13 gap-1">
                <SheetHeader className="p-0 pl-4 pt-2">
                    <SheetTitle>
                        Search Extensions
                    </SheetTitle>
                </SheetHeader>
                <div className="flex items-center justify-between border-b px-2">
                    <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search extensions..."
                            className="flex-1 px-2 py-0 rounded-none shadow-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={query}
                            onChange={(e) => { 
                                setQuery(e.target.value)
                                handleSearch(e.target.value)
                            } }
                        />
                    </div>
                    {query && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setError(null)
                                setQuery("")
                                handleSearch("")
                            }}
                            className="h-8 w-8 p-0"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {/* search result */}
                <div className="flex justify-center h-full">
                    {isSearching
                        ? <LoadingPinWheel size="w-4 h-4" />
                        : error
                            ? <div> Error: {error} </div>
                            : searchResult.length === 0
                                ? <div>Nothing Here</div>
                                : <div>
                                    {searchResult.map((extension) => {
                                        const state = getButtonState(extension.id, extension.version)
                                        return (
                                        <div
                                                className="flex items-center justify-between gap-4 p-4 
                                                border-b"
                                        key={extension.id}>
                                        <div className="flex-1">
                                                    <h1 className="font-semibold text-base">{extension.name} 
                                                        <span className="text-xs">({extension.version})</span>
                                            </h1>
                                            <p className="text-xs text-muted-foreground">{extension.description}</p>
                                        </div>
                                                <Button
                                                    onClick={() => handleAction(state,extension.id, extension.url)}
                                                    disabled={isWorkingOn === extension.id}
                                                    className="cursor-pointer">
                                                    {state == "NEW"
                                                        ? "Install" : state == "UPDATE" ? "Update" : "Uninstall"}
                                                    {isWorkingOn && <LoadingPinWheel size="w-4 h-5" />}
                                        </Button>
                                    </div>
                                    )
                                })}
                                </div>
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}