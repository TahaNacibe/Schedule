import { Braces } from "lucide-react";
import { DataTable } from "../components/developers/extenstion_table";
import { ExtensionsColumns } from "../components/developers/extenstion_column";
import { createNewExtensionInstance, deleteExistingExtension, fetchUserOwnedExtensions, updateExtensionInstance } from "@/services/extenstions_store";
import { useProfile } from "@/contexts/ProfileContext";
import costumeToast from "@/components/costume/costume_toast";
import { useEffect, useState } from "react";
import LoadingPinWheel from "@/components/costume/spinner_wheel";


export default function DevelopersSection() {
    const [userOwnedExtensions, setUserOwnedExtensions] = useState<ExtensionInstance[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [updatingTarget, setUpdatingTarget] = useState<string | null>(null)
    const { userProfile } = useProfile()
    
    const handleCreateNewExtensionEntry = async (ext: Partial<ExtensionInstance>) => {
        setUpdatingTarget("TempId")
        const res = await createNewExtensionInstance({
            profile: userProfile,
            extension: ext
        })
        if (!res.success) {
            costumeToast({content: res.message, type:"ERROR"})
            return;
        }
        setUserOwnedExtensions(prev => [...prev, res.data as ExtensionInstance])
        setUpdatingTarget(null)
    }

    const handleUpdateExistingExtension = async (updatedExt: Partial<ExtensionInstance>) => {
        console.log(updatedExt)
        // set the target
        setUpdatingTarget(updatedExt.id!)

        const res = await updateExtensionInstance({
            profile: userProfile,
            extension: updatedExt
        })

        if (!res.success) {
            console.log(res)
            costumeToast({content: res.message, type: "ERROR"})
            return;
        }
        const updatedList = userOwnedExtensions.map((ext) => {
            return ext.id != updatedExt.id ? ext : updatedExt
        }) as ExtensionInstance[]
        setUserOwnedExtensions(updatedList)
        setUpdatingTarget(null)
    }

    const handleDeleteExistingExtension = async (ext_id: string) => {
        setUpdatingTarget(ext_id)
        const res = await deleteExistingExtension(ext_id)
        if (!res.success) {
            costumeToast({content: res.message, type: "ERROR"})
            return;
        }

        const updatedList = userOwnedExtensions.filter((ext) => ext.id != ext_id)
        setUserOwnedExtensions(updatedList)
        setUpdatingTarget(null)
    }

    const handleReadUserOwnedExtensions = async () => {
        const res = await fetchUserOwnedExtensions(userProfile)
        if (!res.success || !res.data) {
            costumeToast({content: res.message, type:"ERROR"})
            return;
        }
        setUserOwnedExtensions(res.data as ExtensionInstance[])
        setIsLoading(false)
    }


    useEffect(() => {
        handleReadUserOwnedExtensions()
    },[userProfile])



    const columns = ExtensionsColumns({
        onUpdate: handleUpdateExistingExtension,
        onDelete: handleDeleteExistingExtension,
        updateTarget: updatingTarget,
        isLoading: updatingTarget != null
    })

    return (
        <div className="pl-12 pb-8 max-w-5xl">
            <div className="flex items-center gap-3 mb-8 pl-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Braces className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Developers</h1>
                    <p className="text-sm text-muted-foreground">Create and manage your extensions so others can share and hop on</p>
                </div>
            </div>
            <div className="px-2">
                {isLoading
                    ? <div className="w-full flex items-center justify-center flex-col gap-2 py-4">
                        <LoadingPinWheel size="w-8 h-8" />
                        <p className="text-sm">Working on it...</p>
                    </div> 
                    : <DataTable
                    onCreate={handleCreateNewExtensionEntry}
                        columns={columns}
                        isLoading={updatingTarget != null}
                    data={userOwnedExtensions} />}
            </div>
        </div>
    )
}