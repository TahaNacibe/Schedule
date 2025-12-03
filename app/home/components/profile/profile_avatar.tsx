import LoadingPinWheel from "@/components/costume/spinner_wheel";
import { Camera, ArrowUp } from "lucide-react";

interface ProfileAvatarProps {
    isLocalProfile: boolean;
    photoUrl?: string | null;
    userName: string;
    selectedImage: string | null;
    isUpdating: boolean;
    onUpdate: () => void;
}

export function ProfileAvatar({
    isLocalProfile,
    photoUrl,
    userName,
    selectedImage,
    isUpdating,
    onUpdate,
}: ProfileAvatarProps) {
    return (
        <div className="relative mb-4">
        <div className="relative inline-block">
            {(selectedImage != null || photoUrl != null)
            ? <img
            src={selectedImage! || photoUrl!}
            alt={userName}
            className="w-32 h-32 rounded-full border-6 border-background shadow-xl object-cover top-0"
                    />
                    : <div className="w-32 h-32 rounded-full border-6 border-background shadow-xl object-cover top-0 
            bg-accent
            flex items-center justify-center">
                <h1 className="text-5xl font-semibold">
                {userName.slice(0,2).toUpperCase()}            
                </h1>
            </div>
                }
            
            {isUpdating && (
            <div className="bg-accent/50 w-32 h-32 absolute top-0 rounded-full flex items-center justify-center">
                <LoadingPinWheel size="w-8 h-8" />
            </div>
            )}
            
            {isLocalProfile && <button
            disabled={isUpdating}
            onClick={onUpdate}
            className={`absolute bottom-2 right-1 bg-background p-2 rounded-full cursor-pointer
                shadow-lg ${isUpdating ? "" : "hover:bg-accent transition-colors"}`} 
            >
            {isUpdating ? (
                <ArrowUp className="w-4 h-4" />
            ) : (
                <Camera className="w-4 h-4" />
            )}
            </button>}
        </div>
        </div>
    );
}
