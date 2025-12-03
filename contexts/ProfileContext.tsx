"use client"
import { useAuth } from '@/hooks/useAuth';
import { ACCESS_REJECTED, TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR } from '@/lib/errors_handlers';
import { fetchUsersListBasedOnState, fetchUsersProfiles } from '@/services/firebase_services';
import FriendRequestData from '@/Types/friend_request_data';
import FriendRequest from '@/Types/request';
import { Timestamp } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

type ProfileContextType = {
  userSignedIn: boolean;
  userProfile: Profile | null;
  friends: Profile[];
  requests: FriendRequestData;
  updateAuthState: (state: boolean) => void;
  updateCurrentUser: (user: Profile | null) => void;
  updateFriendsList: (updater: Profile[] | ((prev: Profile[]) => Profile[])) => void;
  updateRequestsList: (targetProfile: Profile, isRemove: boolean) => void;
  fetchUserProfile: () => Promise<CustomResponse>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileApiProvider({ children }: { children: React.ReactNode }) {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [friends, setFriendsList] = useState<Profile[]>([]);
  const [requests, setRequestsLists] = useState<FriendRequestData>({
    received_requests: [],
    sent_requests: [],
    users: [],
  });
  const { user } = useAuth();

  // Auto-fetch on user change
  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
      setFriendsList([]);
      setRequestsLists({ received_requests: [], sent_requests: [], users: [] });
    }
  }, [user]);

  async function fetchUserProfile() {
    if (!user) return ACCESS_REJECTED;
    const res = await fetchUsersProfiles({ user_ids: [user.uid], currentUser_id: user.uid });
    if (res.success && res.data!.length > 0) {
      setUserProfile(res.data![0] as Profile);

      const friendsRes = await fetchUsersListBasedOnState({ user_id: user.uid, target_status: "ACCEPTED" });
      if (friendsRes.success) {
        setFriendsList(friendsRes.data as Profile[]);
      }

      const requestsRes = await fetchUsersListBasedOnState({ user_id: user.uid, target_status: "PENDING" });
      if (requestsRes.success) {
        setRequestsLists(requestsRes.data as FriendRequestData);
      }

      return TASK_COMPLETED_SUCCESSFULLY(null)
    }
    return UNKNOWN_ERROR
  }

  const updateAuthState = useCallback((state: boolean) => {
    setUserSignedIn(state);
  }, []);

  const updateCurrentUser = useCallback((user: Profile | null) => {
    setUserProfile(user);
  }, []);

  const updateFriendsList = useCallback((updater: Profile[] | ((prev: Profile[]) => Profile[])) => {
    setFriendsList(updater);
  }, []);

  const updateRequestsList = useCallback((targetProfile: Profile, isRemove: boolean) => {
    setRequestsLists((prev) => {
      let updatedList: Profile[] = [];
      let sentRequests: FriendRequest[] = prev.sent_requests;
      let receivedRequests: FriendRequest[] = prev.received_requests; // Fixed: Use received, not sent
      const targetRequestId = [targetProfile.user_id, user?.uid ?? ''].sort().join("_");

      if (isRemove) {
        updatedList = prev.users.filter((u) => u.user_id !== targetProfile.user_id);
        receivedRequests = prev.received_requests.filter((r) => r.request_id !== targetRequestId);
        sentRequests = prev.sent_requests.filter((r) => r.request_id !== targetRequestId);
      } else {
        sentRequests = [
          ...prev.sent_requests,
          {
            receiver_id: targetProfile.user_id,
            sender_id: user?.uid ?? '',
            status: "PENDING",
            request_id: targetRequestId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          },
        ];
        updatedList = [...prev.users, targetProfile];
      }

      const updatedItems = {
        ...prev,
        users: updatedList,
        sent_requests: sentRequests,
        received_requests: receivedRequests,
      };
      return updatedItems;
    });
  }, [user?.uid]); // Dep on user.uid for safety

  const fetchUserProfileCb = useCallback(fetchUserProfile, [user?.uid]);

  const value = useMemo(() => ({
    userSignedIn,
    userProfile,
    friends,
    requests,
    updateAuthState,
    updateCurrentUser,
    updateFriendsList,
    updateRequestsList,
    fetchUserProfile: fetchUserProfileCb,
  }), [
    userSignedIn,
    userProfile,
    friends,
    requests,
    updateAuthState,
    updateCurrentUser,
    updateFriendsList,
    updateRequestsList,
    fetchUserProfileCb,
  ]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within a ProfileContextProvider');
  }
  return ctx;
};