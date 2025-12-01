import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useProfile } from "@/contexts/ProfileContext"
import { useState, useEffect } from "react"
import { FriendItem } from "../components/friend_item"
import { createFriendRequest, searchUsers, updateFriendRequest } from "@/services/firebase_services"
import { useAuth } from "@/hooks/useAuth"
import LoadingPinWheel from "@/components/costume/spinner_wheel"
import { useFriendsManagement } from "@/hooks/user_friends_managements"
import { MISSING_REQUIRED_ARGUMENT, UNKNOWN_ERROR } from "@/lib/errors_handlers"

export default function SearchDialog() {
    const [searchKey, setSearchKey] = useState("")
    const [searchUsersResult, setSearchUsersResult] = useState<Profile[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [open, setOpen] = useState(false)
    //* use hooks
    const { friends, requests, updateRequestsList, updateFriendsList } = useProfile()
    const {handleAcceptRequest,handleRejectRequest,handleRemoveFriend} = useFriendsManagement()
    const {user} = useAuth()


    //* Listen to keys change
    useEffect(() => {
    const handler = (e: MessageEvent) => {
        if (e.data?.type === "global-keydown") {
        const { key, ctrl, meta } = e.data;
        if (key === "s" && (ctrl || meta)) {
            e.preventDefault();
            setOpen(o => !o);
        }
        }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
    }, []);


    

    // handle add friend
    const sendFriendRequest = async (friend_id: string) => {
        if (!friend_id || !user)
            return
        try {
            const res = await createFriendRequest({ sender_id: user.uid, receiver_id: friend_id })
            if (res.success) {
                const target_user = searchUsersResult.filter((user) => user.user_id === friend_id)
                if (target_user && target_user.length > 0) {
                    updateRequestsList(target_user[0], false)
                    const updatedSearchResult = searchUsersResult.filter((user) => user.user_id != friend_id)
                    setSearchUsersResult(updatedSearchResult)
                }
                return;
            }
            //ToDo: add error handling
        } catch (error) {
            //ToDo: add error handling
        }
    }

    const acceptFriendRequest = async (friend_id: string) => {
        if (!friend_id || !user)
            return MISSING_REQUIRED_ARGUMENT;
        try {
            const request_id = [friend_id, user.uid].sort().join("_")
            const res = await updateFriendRequest({ request_id, new_state: "ACCEPTED" })
            if (res.success) {
                const target_user = requests.users.filter((user) => user.user_id === friend_id)
                if (target_user && target_user.length > 0) {
                    handleAcceptRequest(target_user[0], user.uid)
                    // update search
                    const updatedSearchResult = searchUsersResult.filter((user) => user.user_id != friend_id)
                    setSearchUsersResult(updatedSearchResult)
                }
            }
            //ToDo: add error handling
            return res
            console.log("fuck me")
        } catch (error) {
            //ToDo: add error handling
            return UNKNOWN_ERROR
            console.log("fuck me harder" + error)
        }
    }




    // search
    const handleSearch = async (e: string) => {
        setSearchKey(e)
        if (e.trim().length === 0) {
            setSearchUsersResult([])
            return;
        }
        try {
            setIsSearching(true)
            const res = await searchUsers({
                user_name: e,
                user_id: user!.uid
            })
            if (res.success) {
                const new_users = (res.data as Profile[]).filter((profile) => {
                    return profile.user_id != user!.uid && profile.state != "ACCEPTED" && profile.state != "PENDING"
                })
                setSearchUsersResult(new_users)
            }
        } catch (error) {
            console.log("fuck")
        } finally {
            setIsSearching(false)
        }
    }

    
    return (
        <>
        <p className="text-muted-foreground text-sm">
            Press{" "}
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>S 
            </kbd>
            <span> to search</span>
        </p>
        <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="search by name..."
                    value={searchKey}
                    onValueChange={(e) => handleSearch(e)} />
        <CommandList>
            {/* Friends */}
            <CommandGroup heading="Friends">
            {friends.map((profile, _) => {
                return (
                    <CommandItem key={profile.user_id}>
                        <FriendItem
                        display="search"    
                        profile={profile} variant={"friend"} />
                    </CommandItem>
                )
            })}
            </CommandGroup>
            <CommandSeparator />
            {/* Requests */}
            <CommandGroup heading="Requests">
            {(requests ?? []).users.map((profile, _) => {
                return (
                    <CommandItem key={profile.user_id}>
                        <FriendItem 
                            onAccept={() => acceptFriendRequest(profile.user_id)}
                            display="search"
                        profile={profile} variant={"request"} />
                    </CommandItem>
                )
            })}
            </CommandGroup>
            <CommandSeparator />
            {/* Search Results */}
            {isSearching ? (
                <div className="flex justify-center items-center py-6">
                    <LoadingPinWheel size="w-5 h-5" />
                </div>
            ) : searchUsersResult.length > 0 ? (
                    <CommandGroup
                    heading="Search Results" forceMount>
                    {searchUsersResult.map((profile) => {
                        return (
                            <CommandItem key={profile.user_id}>
                                <FriendItem
                                    display="search"
                                    onAdd={() => sendFriendRequest(profile.user_id)}
                                    profile={profile}
                                    variant={'discover'} />
                            </CommandItem>
                        )
                    })}
                </CommandGroup>
            ) : searchKey.trim().length > 0 ? (
                <CommandEmpty>No users found.</CommandEmpty>
            ) : null}
        </CommandList>
        </CommandDialog>
        </>
    )
}