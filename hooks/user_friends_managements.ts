import { useProfile } from "@/contexts/ProfileContext";
import { updateFriendRequest } from "@/services/firebase_services";


export function useFriendsManagement() {
  const {
    friends,
    requests,
    updateFriendsList,
    updateRequestsList,
  } = useProfile();

  const handleAcceptRequest = async (requestProfile: Profile, user_id: string): Promise<CustomResponse> => {
    const res = await updateFriendRequest({
      request_id: [requestProfile.user_id, user_id].sort().join("_"),
      new_state: "ACCEPTED",
    });
    if (res.success) {
      // Functional update: Uses latest state at call time
      updateFriendsList((prev) => [...prev, requestProfile]);
      updateRequestsList(requestProfile, true);
    }
    return res;
  };

  const handleRejectRequest = async (requestProfile: Profile, user_id: string): Promise<CustomResponse> => {
    const res = await updateFriendRequest({
      request_id: [requestProfile.user_id, user_id].sort().join("_"),
      new_state: "IGNORED",
    });

    if (res.success) {
      updateRequestsList(requestProfile, true);
    }
    return res;
  };

  const handleRemoveFriend = async (friendProfile: Profile, user_id: string): Promise<CustomResponse> => {
    const res = await updateFriendRequest({
      request_id: [friendProfile.user_id, user_id].sort().join("_"),
      new_state: "IGNORED",
    });
    if (res.success) {
      // Functional update: Uses latest state at call time
      updateFriendsList((prev) => prev.filter((friend) => friend.user_id !== friendProfile.user_id));
    }
    return res;
  };

  return {
    friends,
    requests,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend,
  };
}