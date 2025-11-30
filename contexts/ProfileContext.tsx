"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';



type ProfileContextType = {
    updateAuthState:(state:boolean) => void ,
    getUserAuthState:() => boolean ,
    updateCurrentUser:(user:Profile) => void ,
    getCurrentUserProfile:() => Profile | null,
    updateFriendsList:(friendsList: Profile[]) => void ,
    getFriendsList:() => Profile[] ,
    updateRequestsList:(requestsList: Profile[]) => void ,
    getRequestsList:() => Profile[] ,
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileApiProvider({ children }: { children: React.ReactNode }) {
    const [userSignedIn, setUserSignedIn] = useState(false)
    const [user, setUser] = useState<Profile | null>(null)
    const [friends, setFriendsList] = useState<Profile[]>([])
    const [requests, setRequestsLists] = useState<Profile[]>([])
    // auth
    function updateAuthState(state: boolean) {
        setUserSignedIn(state)
    }
    function getUserAuthState() {
        return userSignedIn
    }


    // user profile
    function updateCurrentUser(user: Profile) {
        setUser(user)
    }
    function getCurrentUserProfile() {
        return user
    }

    // 
    function updateFriendsList(friendsList: Profile[]) {
        const uniqueList = Array.from(
        new Map([...friends, ...friendsList].map(friend => [friend.user_id, friend])).values()
        );
        setFriendsList(uniqueList)
    }
    function getFriendsList() {
        return friends
    }


    function updateRequestsList(requestsList: Profile[]) {
        const uniqueList = Array.from(
        new Map([...requests, ...requestsList].map(request => [request.user_id, request])).values()
        );
        setRequestsLists(uniqueList)
    }
    function getRequestsList() {
        return requests
    }



    return <ProfileContext.Provider
    value={{ 
        updateAuthState,
        getUserAuthState,
        updateCurrentUser,
        getCurrentUserProfile,
        updateFriendsList,
        getFriendsList,
        updateRequestsList,
        getRequestsList,
    }}>
    {children}
    </ProfileContext.Provider>;
}

export const useProfile = () => {
    const ctx = useContext(ProfileContext);
    if (!ctx) {
        throw new Error('useProfile must be used within an ProfileContextProvider');
    }
    return ctx;
};