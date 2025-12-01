import { Timestamp } from "firebase/firestore";

export default interface FriendRequest {
        request_id:string,
        sender_id: string,
        receiver_id: string,
        createdAt: Timestamp,
        updatedAt: Timestamp,
        status: "PENDING" | "ACCEPTED" | "IGNORED"
}

