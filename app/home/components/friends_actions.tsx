import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus, UserX, X } from "lucide-react";

interface FriendActionsProps {
    variant: "friend" | "request" | "discover";
    state: "RECEIVED" | "SENT"
    onAccept?: () => void;
    onReject?: () => void;
    onRemove?: () => void;
    onAdd?: () => void;
}

export function FriendActions({ variant, state,onAccept, onReject, onRemove, onAdd }: FriendActionsProps) {
    if (variant === "friend") {
        return (
            <Button variant="outline" size="sm" onClick={(e) => {
                e.preventDefault()
                onRemove?.()
        }} className="cursor-pointer">
            <UserX className="w-4 h-4 mr-2" />
            Remove
        </Button>
        );
    }

    if (variant === "discover") {
        return (
            <Button variant="outline" size="sm" onClick={(e) => {
                e.preventDefault()
                onAdd?.()
        }} className="cursor-pointer">
            <UserPlus className="w-4 h-4 mr-2" />
        </Button>
        );
    }

    return (
        <div className="flex gap-2 pr-4">
            {state != "SENT" && <Button size="sm" onClick={(e) => {
                e.preventDefault()
                onAccept?.()
        }} className="cursor-pointer">
            <UserCheck className="w-4 h-4 text-background!" />
        </Button>}
            <Button variant="outline" size="sm" onClick={(e) => {
                e.preventDefault()
                onReject?.()
        }} className="cursor-pointer">
            <X className="w-4 h-4" />
        </Button>
        </div>
    );
}