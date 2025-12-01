import { FriendActions } from "@/app/home/components/friends_actions";
import { FriendAvatar } from "@/app/home/components/friends_avatar";
import { FriendInfo } from "@/app/home/components/friends_info";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";

interface OthersFriendItemProps {
    profile: Profile;
    display: "search" | "table"
    onAccept?: (profile: Profile, user_id:string) => Promise<CustomResponse>;
    onReject?: (profile: Profile, user_id:string) => Promise<CustomResponse>;
    onRemove?: (profile: Profile, user_id:string) => Promise<CustomResponse>;
    onAdd?: (profile: Profile) => void;
}

export function OthersFriendItem({
    profile,
    display,
    onAccept,
    onReject,
    onRemove,
    onAdd,
}: OthersFriendItemProps) {
    const { friends, requests } = useProfile()
    const [request_state, set_request_state] = useState<"SENT"|"RECEIVED">("SENT")
    const { user } = useAuth()
    
    const checkRelationshipState = (target_id: string) => {
        const friends_ids_list = friends.map((profile) => profile.user_id)
        if (friends_ids_list.includes(target_id))
            return "friend"

        const received_ids_requests = requests.received_requests.map((request) => request.receiver_id)
        if (received_ids_requests.includes(target_id)) {
                console.log("action one")
                set_request_state("SENT")
                return "request"
            }
        
        const sent_ids_requests = requests.sent_requests.map((request) => request.sender_id)
        if (sent_ids_requests.includes(target_id)) {
            console.log("action 2" + target_id)
                set_request_state("RECEIVED")
                return "request"
        }

        return "discover"
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
        {(user?.uid != profile.user_id) && <FriendActions
            variant={checkRelationshipState(profile.user_id)}
            state={request_state}
            onAccept={() => onAccept?.(profile, user!.uid)}
            onReject={() => onReject?.(profile, user!.uid)}
            onRemove={() => onRemove?.(profile, user!.uid)}
            onAdd={() => onAdd?.(profile)}
        />}
        </Link>
    );
}
