import { useProfile } from "@/contexts/ProfileContext";
import { FriendActions } from "./friends_actions";
import { FriendAvatar } from "./friends_avatar";
import { FriendInfo } from "./friends_info";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface FriendItemProps {
    profile: Profile;
    variant: "friend" | "request" | "discover";
    display: "search" | "table"
    onAccept?: (profile: Profile, user_id:string) => Promise<CustomResponse>;
    onReject?: (profile: Profile, user_id:string) => Promise<CustomResponse>;
    onRemove?: (profile: Profile, user_id:string) => Promise<CustomResponse>;
    onAdd?: (profile: Profile) => void;
}

export function FriendItem({
    profile,
    variant,
    display,
    onAccept,
    onReject,
    onRemove,
    onAdd,
}: FriendItemProps) {
    const { requests } = useProfile()
    const {user} = useAuth()
    const checkIfUserOwnTheRequest = (target_id: string) => {
        const senders_ids = requests.sent_requests.map((request) => request.sender_id)
        return senders_ids.includes(target_id) ? "RECEIVED" : "SENT"
    }

    return (
        <Link
        href={`/people/${profile.user_id}`}
        className={`flex items-center justify-between  
        ${display === "search" ? "" :  "border-b hover:bg-accent p-2 py-3" }
        transition-colors w-full`}>
        <div className="flex items-center gap-4">
            <FriendAvatar photoUrl={profile.photo_URL} userName={profile.user_name} size={display === "search" ? "sm" : "md"} />
            <FriendInfo userName={profile.user_name} />
        </div>
        <FriendActions
            variant={variant}
            state={checkIfUserOwnTheRequest(profile.user_id)}
            onAccept={() => onAccept?.(profile, user!.uid)}
            onReject={() => onReject?.(profile, user!.uid)}
            onRemove={() => onRemove?.(profile, user!.uid)}
            onAdd={() => onAdd?.(profile)}
        />
        </Link>
    );
}
