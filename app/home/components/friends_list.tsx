import { FriendItem } from "./friend_item";

interface FriendsListProps {
    friends: Profile[];
    onRemove: (profile: Profile, user_id:string) => Promise<CustomResponse>;
}

export function FriendsList({ friends, onRemove }: FriendsListProps) {
    if (friends.length === 0) {
        return (
        <p className="text-muted-foreground text-center py-8">No friends yet</p>
        );
    }

    return (
        <div className="divide-y">
        {friends.map((friend) => (
            <FriendItem
            display="table"
            key={friend.user_id}
            profile={friend}
            variant="friend"
            onRemove={onRemove}
            />
        ))}
        </div>
    );
}