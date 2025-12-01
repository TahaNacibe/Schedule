import { OthersFriendItem } from "./friend_item";


interface OthersFriendsListProps {
    friends: Profile[];
    onRemove: (profile: Profile, user_id: string) => Promise<CustomResponse>;
    onAccept: (profile: Profile, user_id:string) => Promise<CustomResponse>
    onReject: (profile: Profile, user_id: string) => Promise<CustomResponse>;
    onAdd: (profile: Profile) => void;
}

export function OthersFriendsList({friends, onRemove, onAccept, onReject, onAdd }: OthersFriendsListProps) {
    if (friends.length === 0) {
        return (
        <p className="text-muted-foreground text-center py-8">No friends yet</p>
        );
    }

    return (
        <div className="divide-y">
        {friends.map((friend) => (
            <OthersFriendItem
            display="table"
            key={friend.user_id}
            profile={friend}
            onRemove={onRemove}
            onAccept={onAccept}
            onReject={onReject}
            onAdd={onAdd}
            />
        ))}
        </div>
    );
}