import costumeToast from "@/components/costume/costume_toast";
import LoadingPinWheel from "@/components/costume/spinner_wheel";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileUpdate } from "@/hooks/use_profile_updater";
import { User, FileText, Edit2 } from "lucide-react";
import { useState } from "react";


interface EditProfileDialogInterface {
    userName: string,
    bio: string,
}
export default function EditProfileDialog({
    bio, userName
}: EditProfileDialogInterface) {
    const [editedName, setEditedName] = useState(userName)
    const [editedBio, setEditedBio] = useState(bio)
    const [dialogState, setDialogState] = useState(false)
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
    const {updateProfileHeader} = useProfileUpdate()


    const handleProfileUpdate = async () => {
        if (editedName.trim().length === 0 || bio.trim().length === 0) {
            costumeToast({
                content: `${editedName.trim().length === 0 ? "User name can't be empty"
                    : "a bio must be at least one word"}`, type: "ALERT"
            })
            return;
        }
        setIsUpdatingProfile(true)
        await updateProfileHeader({
            userName: editedName,
            bio:editedBio
        })
        setIsUpdatingProfile(false)
        setDialogState(false)
    }


    return (
        <Dialog open={dialogState} onOpenChange={setDialogState}>
        <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setDialogState(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
                Make changes to your profile here. Click save when you're done.
            </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
            <div className="grid gap-2">
            <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Display Name
            </Label>
            <Input
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                placeholder="Enter your name"
                className="col-span-3"
                maxLength={29}
            />
            </div>

            <div className="grid gap-2">
            <Label htmlFor="bio" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Bio
            </Label>
            <Textarea
                id="bio"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="col-span-3 resize-none"
                rows={4}
                lang="en"
                maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
                {editedBio.length} / 200 characters
            </p>
            </div>
        </div>

        <DialogFooter>
                    <Button
                        disabled={isUpdatingProfile}
                        onClick={() => {
                            setEditedBio(bio)
                            setEditedName(userName)
                            setDialogState(false)
                        }}
                        variant="outline">
                Cancel
            </Button>
                    <Button
                        disabled={isUpdatingProfile}
                        onClick={handleProfileUpdate}>
                        {isUpdatingProfile ? <div className="flex gap-2">
                        <LoadingPinWheel size="h-4 w-4" />
                            Updating....
                        </div>
                        :<div>
                            Save Changes
                        </div>}
                        </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}