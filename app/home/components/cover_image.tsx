import { Button } from "@/components/ui/button";
import LoadingPinWheel from "@/components/costume/spinner_wheel";
import { Camera } from "lucide-react";

interface CoverImageProps {
    isLocalProfile: boolean;
    coverUrl?: string | null;
    selectedImage: string | null;
    isUpdating: boolean;
    onUpdate: () => void;
}

export function CoverImage({
    isLocalProfile,
    coverUrl,
    selectedImage,
    isUpdating,
    onUpdate,
}: CoverImageProps) {
    return (
    <div className="relative w-full h-72 bg-linear-to-r from-blue-500 to-purple-600 overflow-hidden">
        {(selectedImage || coverUrl != null) && (
            <img
            src={selectedImage || coverUrl!}
            alt="Cover"
            className="w-full h-full object-cover"
            />
        )}

        {isUpdating && (
            <div className="w-full h-full object-cover absolute top-0 bg-accent/50 flex items-center justify-center">
            <LoadingPinWheel size="h-12 w-12" />
            </div>
        )}

        {isLocalProfile && <Button
            onClick={onUpdate}
            disabled={isUpdating}
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 rounded-full shadow-lg cursor-pointer z-20"
        >
            {isUpdating ? (
            <div className="flex gap-1">
                <LoadingPinWheel size="h-4 w-4" />
                Working on it...
            </div>
            ) : (
            <div className="flex gap-1">
                <Camera className="w-4 h-4 mr-2" />
                Update Cover
            </div>
            )}
        </Button>}
        </div>
    );
}
