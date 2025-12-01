import FriendRequestData from "@/Types/friend_request_data";
import { FriendItem } from "./friend_item";

interface RequestsListProps {
    requests: FriendRequestData;
    onAccept: (profile: Profile, user_id:string) => Promise<CustomResponse>
    onReject: (profile: Profile, user_id:string) => Promise<CustomResponse>;
}

export function RequestsList({ requests, onAccept, onReject }: RequestsListProps) {
    if (requests.users.length === 0) {
        return (
        <p className="text-muted-foreground text-center py-8">
            No pending requests
        </p>
        );
    }

    return (
        <div className="divide-y">
        {requests.users.map((request) => (
            <FriendItem
            display="table"
            key={request.user_id}
            profile={request}
            variant="request"
            onAccept={onAccept}
            onReject={onReject}
            />
        ))}
        </div>
    );
}
