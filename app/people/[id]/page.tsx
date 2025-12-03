"use client"
import { ProfileSection } from "@/app/home/sections/profile_section";
import LoadingPinWheel from "@/components/costume/spinner_wheel";
import { useAuth } from "@/hooks/useAuth";
import { createFriendRequest, fetchUsersListBasedOnState, fetchUsersProfiles } from "@/services/firebase_services";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { OthersFriendsList } from "../components/friends_list";
import { useFriendsManagement } from "@/hooks/user_friends_managements";
import { useProfile } from "@/contexts/ProfileContext";
import { Users } from "lucide-react";
import ListDisplayPlaceHolder from "../components/friends_visibility";

//ToDo: check and complete this
export default function PeopleProfile() {
    const params = useParams();
    const { user } = useAuth()
    const id = params.id as string;
    const [userProfile, setUserProfile] = useState<Profile | null>()
    const [usersFriends, setUsersFriends] = useState<Profile[]>([])
    const [isLoadingFriends, setIsLoadingFriends] = useState(true)
    const [isFriendsVisible, setIsFriendsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const {
        handleAcceptRequest,
        handleRejectRequest,
        handleRemoveFriend,
    } = useFriendsManagement();
    const { updateRequestsList } = useProfile()


    const sendFriendRequest = async (profile: Profile) => {
        if (!profile || !user)
            return
        try {
            const res = await createFriendRequest({ sender_id: user.uid, receiver_id: profile.user_id })
            if (res.success) {
                updateRequestsList(profile, false)
                return;
            }
            //ToDo: add error handling
        } catch (error) {
            //ToDo: add error handling
        }
    }

        const getCurrentUserFriendsList = async () => {
            if (userProfile && userProfile.friends_visibility) {
                const res = await fetchUsersListBasedOnState({ user_id: id, target_status: "ACCEPTED" })
                if (res.success) {
                    setUsersFriends(res.data as Profile[])
                }
            } else {
                setIsFriendsVisible(false)
            }
            setIsLoadingFriends(false)
        }


        useEffect(() => {
            if (user && id) {
                const loadUserProfile = async () => {
                    setIsLoading(true)
                    const res = await fetchUsersProfiles({ user_ids: [id], currentUser_id: user.uid })
                    if (res.success && res.data && res.data.length > 0) {
                        setUserProfile(res.data[0] as Profile)
                    }
                    setIsLoading(false)
                }
            
                loadUserProfile()
            }
        }, [user])
    

        useEffect(() => {
            getCurrentUserFriendsList()
        }, [userProfile])


        if (isLoading) {
            return (
                <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
                    {isLoading
                        && <div className="flex flex-col gap-2 items-center justify-center">
                            <LoadingPinWheel size="h-10 w-10" />
                            Working on it...
                        </div>
                        }
                </div>
            )
        }

        return (
            <div className="flex">
                <ProfileSection profile={userProfile!} isLocalProfile={false} />
                <div className="w-1/3 border-t from-background to-muted/20 border-l border-gray-300 dark:border-gray-600">
                <div className="pt-8 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold tracking-tight">Friends</h2>
                                <p className="text-xs text-muted-foreground">
                                    {usersFriends.length} connection{usersFriends.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-border" />
                        </div>

                    {userProfile?.friends_visibility
                        ? <OthersFriendsList 
                            friends={usersFriends}
                            onAdd={sendFriendRequest}
                            onReject={handleRejectRequest}
                            onAccept={handleAcceptRequest}
                            onRemove={handleRemoveFriend} 
                        />
                        : <ListDisplayPlaceHolder title={
                            <h1 className="flex flex-col">Sadly
                            <span>{userProfile?.user_name}'s</span> Friends are not visible
                            </h1>
                    } Icon={Users} />}
                    </div>
            </div>
        )
    }
