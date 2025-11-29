import { useAuth } from "@/hooks/useAuth"
import {
    ACCESS_REJECTED, ERROR_COMPLETING_TASK, MISSING_REQUIRED_ARGUMENT,
    TARGET_WAS_NOT_FOUND, TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR
} from "@/lib/errors_handlers"
import { db } from "@/lib/firebase"
import FriendRequest from "@/Types/request";
import {
    collection, deleteDoc, doc, getDoc, getDocs, limit,
    query, setDoc, Timestamp, updateDoc, where
} from "firebase/firestore"



const USERS_COLLECTION = collection(db, "users")
const REQUESTS_COLLECTION = collection(db, "requests")


function generateSearchTokens(text: string): string[] {
    if (!text) return [];

    const lower = text.toLowerCase().trim();
    const tokens: string[] = [];

    for (let i = 1; i <= lower.length; i++) {
        tokens.push(lower.slice(0, i));
    }

    return tokens;
}



function createRequestId({ sender_id, receiver_id }
    : { sender_id: string, receiver_id: string }) {
    return [sender_id, receiver_id].sort().join("_")
    }


// Create
async function createPublicUser(profile: Profile) {
    try {
        //? ref
        const userDocRef = doc(USERS_COLLECTION, profile.user_id)
        // update data
        await setDoc(userDocRef, {
            ...profile,
            "searchKeyWords": generateSearchTokens(profile.user_name)
        })

        return TASK_COMPLETED_SUCCESSFULLY(profile)
    } catch (error) {
        if (error instanceof Error) {
            return ERROR_COMPLETING_TASK(error);
        }
        return UNKNOWN_ERROR
    }
}


// Update
interface UpdateUserInterface {
    user_id: string,
    profile: Profile
}

async function updatePublicUser({
    user_id,
    profile
}: UpdateUserInterface) {
    const {user} = useAuth()

    try {
        if (!user || user.uid != user_id) 
            return ACCESS_REJECTED

        const userDocRef = doc(USERS_COLLECTION, user_id)
        await updateDoc(userDocRef, {
            ...profile,
            "searchKeyWords": generateSearchTokens(profile.user_name),
            "updateAt": Timestamp.now(),
        })

        return TASK_COMPLETED_SUCCESSFULLY(profile)
    } catch (error) {
        if (error instanceof Error) {
            return ERROR_COMPLETING_TASK(error)
        }
        return UNKNOWN_ERROR
    }
}


// Read

async function fetchUsersProfiles({user_ids, currentUser_id}:{user_ids: string[], currentUser_id:string}) {
    if (user_ids.length == 0)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const usersDocs = await getDocs(query(USERS_COLLECTION,
            where("user_id", "in", user_ids)))
    
        if (usersDocs.docs.length < 0) 
            return TASK_COMPLETED_SUCCESSFULLY([])

        const users = usersDocs.docs.map((user) => {
            return user.data()
        })

        const usersWithFriendState = users.map(async (user) => {
            const res = await getFriendState({ user_id:currentUser_id, otherUser_id: user.user_id })
            if (res.success) {
                return {
                    ...user,
                    state: !res.data ? null : (res.data as FriendRequest).status
                }
            }
        })
            return TASK_COMPLETED_SUCCESSFULLY(usersWithFriendState)
        } catch (error) {
            if (error instanceof Error) {
                return ERROR_COMPLETING_TASK(error)
            }
            return UNKNOWN_ERROR
        }

}


// search
async function searchUsers({user_name, user_id}:{user_name:string, user_id:string}) {
    if (!user_name || !user_id) 
        return MISSING_REQUIRED_ARGUMENT
    
    try {
        const userDocs = await getDocs(query(USERS_COLLECTION,
            where("searchKeyWords", "array-contains", user_name.toLowerCase()), limit(10)))

        if (userDocs.docs.length == 0) 
            return TASK_COMPLETED_SUCCESSFULLY([])

        const users = userDocs.docs.map((user) => {
            return user.data()
        })

        // fetch friend state
        const usersWithFriendState = users.map(async (user) => {
            const res = await getFriendState({ user_id, otherUser_id: user.user_id })
            if (res.success) {
                return {
                    ...user,
                    state: !res.data ? null : (res.data as FriendRequest).status
                }
            }
        })

        return TASK_COMPLETED_SUCCESSFULLY(usersWithFriendState)
    } catch (error) {
        if (error instanceof Error) {
            return ERROR_COMPLETING_TASK(error)
        }
        return UNKNOWN_ERROR
    }
}

// send 
interface FriendRequestInstance {
    sender_id: string,
    receiver_id: string,
}
async function createFriendRequest({ sender_id, receiver_id }
    : FriendRequestInstance) {
    if (!sender_id || !receiver_id)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const data = {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "createdAt": Timestamp.now,
            "updatedAt": Timestamp.now,
            "status": "PENDING",
            "request_id": createRequestId({sender_id, receiver_id})
        }
        const requestsRef = doc(REQUESTS_COLLECTION, createRequestId({sender_id, receiver_id}))
        await setDoc(requestsRef, data,)
        return TASK_COMPLETED_SUCCESSFULLY(data)
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}

// update request
interface UpdateFriendRequestInterface{
    request_id: string,
    new_state: "ACCEPTED" | "IGNORED"
}

async function updateFriendRequest({
    request_id, new_state
}:UpdateFriendRequestInterface) {
    if (!request_id || !new_state)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const requestsRef = doc(REQUESTS_COLLECTION, request_id)
        const request = await getDoc(requestsRef)

        if (!request.exists())
            return TARGET_WAS_NOT_FOUND

        // update if accepted
        if (new_state == "ACCEPTED") {
            await updateDoc(requestsRef, {
                "status": new_state,
                "updatedAt": Timestamp.now()
            })
        }

        // delete if ignored
        if (new_state == "IGNORED") {
            await deleteDoc(requestsRef)
        }

        return TASK_COMPLETED_SUCCESSFULLY(null)
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}

// fetch friends
interface FetchUsersListBasedOnStateInterface {
    user_id: string,
    target_status: "PENDING" | "ACCEPTED" | "IGNORED"
}

async function fetchUsersListBasedOnState({
    user_id, target_status
}:FetchUsersListBasedOnStateInterface) {
    if (!user_id || !target_status)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const targetRequestsDocs = await getDocs(query(REQUESTS_COLLECTION,
            where("status", "==", target_status)))
        if (targetRequestsDocs.empty)
            return TASK_COMPLETED_SUCCESSFULLY([])

        // Fetch requests that are matching the state
        const data = targetRequestsDocs.docs.map((request) => {
            return request.data()
        })

        // fetch users from requests
        const targetUsersIds = data.map((request) => {
            return request.sender_id, request.receiver_id
        })
        const filtered_list : string [] = targetUsersIds.filter((id) => id != user_id)
        const usersResp = await fetchUsersProfiles({ user_ids: filtered_list, currentUser_id:user_id })
        return usersResp
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}



interface GetFriendStateInterface {
    user_id: string,
    otherUser_id:string,
}

async function getFriendState({
    user_id,
    otherUser_id
}:GetFriendStateInterface) : Promise<CustomResponse> {
    if (!user_id || !otherUser_id)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const request = await getDoc(doc(REQUESTS_COLLECTION,
            createRequestId({ sender_id: user_id, receiver_id: otherUser_id })))
        
        if (!request.exists())
            return TASK_COMPLETED_SUCCESSFULLY(null)

        return TASK_COMPLETED_SUCCESSFULLY(request.data())
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}


export {
    createPublicUser,
    updatePublicUser,
    fetchUsersProfiles,
    searchUsers,
    createFriendRequest,
    updateFriendRequest,
    fetchUsersListBasedOnState,
    getFriendState
}