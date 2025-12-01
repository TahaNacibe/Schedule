import FriendRequest from "./request";

export default interface FriendRequestData {
        received_requests: FriendRequest[],
        sent_requests: FriendRequest[],
        users:Profile[]
}