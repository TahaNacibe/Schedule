import {
    ACCESS_REJECTED, ERROR_COMPLETING_TASK, MISSING_REQUIRED_ARGUMENT,
    TARGET_ALREADY_EXIST,
    TARGET_WAS_NOT_FOUND, TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR
} from "@/lib/errors_handlers"
import { db } from "@/lib/firebase"
import FriendRequest from "@/Types/request";
import { User } from "firebase/auth";
import {
    collection, deleteDoc, doc, getDoc, getDocs, limit,
    query, setDoc, Timestamp, updateDoc, where
} from "firebase/firestore"



const USERS_COLLECTION = collection(db, "users")
const REQUESTS_COLLECTION = collection(db, "requests")


/**
 * Generates lowercase prefix tokens used for Firestore prefix search.
 * @param {string} text - Input text to generate tokens from.
 * @returns {string[]} List of prefix tokens.
 */

function generateSearchTokens(text: string): string[] {
    if (!text) return [];

    const lower = text.toLowerCase().trim();
    const tokens: string[] = [];

    for (let i = 1; i <= lower.length; i++) {
        tokens.push(lower.slice(0, i));
    }

    return tokens;
}




/**
 * Creates a deterministic request ID for two users.
 * Ensures the same pair always produces the same ID.
 * @param {Object} params
 * @param {string} params.sender_id - Sender's user ID.
 * @param {string} params.receiver_id - Receiver's user ID.
 * @returns {string} The generated request ID.
 */

function _createRequestId({ sender_id, receiver_id }
    : { sender_id: string, receiver_id: string }) {
    return [sender_id, receiver_id].sort().join("_")
    }



/**
 * Creates a public user profile in Firestore.
 * @param {Profile} profile - The profile data to store.
 * @returns {Promise<CustomResponse>} Operation result.
 */
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


/**
 * Updates an existing public user profile.
 * Only the owner of the profile is allowed to update it.
 * @param {Object} params
 * @param {string} params.user_id - ID of the user to update.
 * @param {Profile} params.profile - Updated profile data.
 * @returns {Promise<CustomResponse>} Operation result.
 */
interface UpdateUserInterface {
    user_id: string,
    profile: Profile,
    user: User
}

//
async function updatePublicUser({
    user_id,
    profile,
    user
}: UpdateUserInterface) {

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




/**
 * Fetches multiple user profiles by ID and attaches friend state relative to the current user.
 * @param {Object} params
 * @param {string[]} params.user_ids - List of user IDs to fetch.
 * @param {string} params.currentUser_id - ID of the user requesting the profiles.
 * @returns {Promise<CustomResponse>} List of profiles with friend states.
 */
async function fetchUsersProfiles({ user_ids, currentUser_id }
    : { user_ids: string[], currentUser_id: string }) {
    if (user_ids.length == 0)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const usersDocs = await getDocs(query(USERS_COLLECTION,
            where("user_id", "in", user_ids)))
            
        // in case call this user 
        if (user_ids.length === 1 && user_ids[0] === currentUser_id) 
            return TASK_COMPLETED_SUCCESSFULLY([{
                ...usersDocs.docs[0].data(),
                state: null
            }])

        const users = usersDocs.docs.map((user) => {
            return user.data()
        })

        const usersWithFriendState = await Promise.all(
            users.map(async (user) => {
                const res = await getFriendState({ user_id:currentUser_id, otherUser_id: user.user_id });
                if (res.success) {
                    return {
                        ...user,
                        state: !res.data ? null : (res.data as FriendRequest).status
                    } as Profile;
                }
                return { ...user, state: null } as Profile; // handle failure case
            })
        );

            return TASK_COMPLETED_SUCCESSFULLY(usersWithFriendState)
        } catch (error) {
            if (error instanceof Error) {
                return ERROR_COMPLETING_TASK(error)
            }
            return UNKNOWN_ERROR
        }

}




/**
 * Searches for users by username using generated search keywords.
 * Also attaches friend state for each result.
 * @param {Object} params
 * @param {string} params.user_name - Search term provided by the user.
 * @param {string} params.user_id - ID of the current user performing the search.
 * @returns {Promise<CustomResponse>} List of matching users with friend states.
 */
async function searchUsers({user_name, user_id}:{user_name:string, user_id:string}) {
    if (!user_name || !user_id) 
        return MISSING_REQUIRED_ARGUMENT
    
    try {
        const userDocs = await getDocs(query(USERS_COLLECTION,
            where("searchKeyWords", "array-contains", user_name.toLowerCase()),
            where("profile_visibility", "==", true), limit(10)))

        if (userDocs.docs.length == 0) 
            return TASK_COMPLETED_SUCCESSFULLY([])

        const users = userDocs.docs.map((user) => {
            return user.data()
        })

        // fetch friend state
        const usersWithFriendState = await Promise.all(
        users.map(async (user) => {
            const res = await getFriendState({ user_id, otherUser_id: user.user_id });
            if (res.success) {
                return {
                    ...user,
                    state: !res.data ? null : (res.data as FriendRequest).status
                } as Profile;
            }
            return { ...user, state: null } as Profile; // handle failure case
        })
    );

        return TASK_COMPLETED_SUCCESSFULLY(usersWithFriendState)
    } catch (error) {
        if (error instanceof Error) {
            return ERROR_COMPLETING_TASK(error)
        }
        return UNKNOWN_ERROR
    }
}




/**
 * Creates or overwrites a friend request between two users.
 * @param {Object} params
 * @param {string} params.sender_id - ID of the user sending the request.
 * @param {string} params.receiver_id - ID of the user receiving the request.
 * @returns {Promise<CustomResponse>} Created friend request data.
 */
interface FriendRequestInstance {
    sender_id: string,
    receiver_id: string,
}
async function createFriendRequest({ sender_id, receiver_id }
    : FriendRequestInstance) {
    if (!sender_id || !receiver_id)
        return MISSING_REQUIRED_ARGUMENT

    const request_id = _createRequestId({sender_id, receiver_id})
    const requestDocRef = await getDoc(doc(REQUESTS_COLLECTION, request_id))

    if (requestDocRef.exists())
        return TARGET_ALREADY_EXIST

    try {
        const data = {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "createdAt": Timestamp.now(),
            "updatedAt": Timestamp.now(),
            "status": "PENDING",
            "request_id": request_id
        }
        const requestsRef = doc(REQUESTS_COLLECTION, request_id)
        await setDoc(requestsRef, data,)
        return TASK_COMPLETED_SUCCESSFULLY(data)
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}




/**
 * Updates a friend request's state.
 *
 * - ACCEPTED → updates the request.
 * - IGNORED → deletes the request.
 *
 * @param {Object} params
 * @param {string} params.request_id - ID of the request to update.
 * @param {"ACCEPTED"|"IGNORED"} params.new_state - New state for the request.
 * @returns {Promise<CustomResponse>} Operation result.
 */
interface UpdateFriendRequestInterface{
    request_id: string,
    new_state: "ACCEPTED" | "IGNORED"
}
//
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




/**
 * Returns a list of users whose friend request state matches a target state.
 *
 * @param {Object} params
 * @param {string} params.user_id - ID of the user requesting the list.
 * @param {"PENDING"|"ACCEPTED"|"IGNORED"} params.target_status - Target request status.
 * @returns {Promise<CustomResponse>} List of users in the requested state.
 */
interface FetchUsersListBasedOnStateInterface {
    user_id: string,
    target_status: "PENDING" | "ACCEPTED" | "IGNORED"
}

async function fetchUsersListBasedOnState({
    user_id, target_status
}: FetchUsersListBasedOnStateInterface) {
    if (!user_id || !target_status)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const sentRequestsQuery = query(
        REQUESTS_COLLECTION,
        where("status", "==", target_status),
        where("sender_id", "==", user_id)
        );
        const receivedRequestsQuery = query(
        REQUESTS_COLLECTION,
        where("status", "==", target_status),
        where("receiver_id", "==", user_id)
        );
        const [sentSnapshot, receivedSnapshot] = await Promise.all([
        getDocs(sentRequestsQuery),
        getDocs(receivedRequestsQuery)
        ]);
        const requests = [
        ...sentSnapshot.docs.map(d => d.data()),
        ...receivedSnapshot.docs.map(d => d.data())
        ];

        // fetch users from requests
        const targetUsersIds = requests.map((r) =>
            r.sender_id === user_id ? r.receiver_id : r.sender_id
        );
        const usersResp = await fetchUsersProfiles({ user_ids: targetUsersIds, currentUser_id: user_id })

        if (target_status === "ACCEPTED") {
            return usersResp
        }
        
        let received_requests : FriendRequest[] = []
        let sent_requests : FriendRequest[] = []
        // get state 
        if (usersResp.success) {
            for (const user of usersResp.data as Profile[]) {
                let target = requests.filter((req) => req.sender_id === user.user_id);
                if (target.length > 0) {
                    sent_requests.push(target[0] as FriendRequest);
                    continue;
                }

                target = requests.filter((req) => req.receiver_id === user.user_id);
                if (target.length > 0) {
                    received_requests.push(target[0] as FriendRequest);
                    continue;
                }
            }
            return TASK_COMPLETED_SUCCESSFULLY({received_requests, sent_requests, users:usersResp.data})
        }
        return usersResp
        // 
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}


/**
 * Retrieves the relationship state between two users (friend request data).
 *
 * @param {Object} params
 * @param {string} params.user_id - The current user ID.
 * @param {string} params.otherUser_id - The other user's ID.
 * @returns {Promise<CustomResponse>} Friend request data or null if none exists.
 */
interface GetFriendStateInterface {
    user_id: string,
    otherUser_id:string,
}
//
async function getFriendState({
    user_id,
    otherUser_id
}:GetFriendStateInterface) : Promise<CustomResponse> {
    if (!user_id || !otherUser_id)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const request = await getDoc(doc(REQUESTS_COLLECTION,
            _createRequestId({ sender_id: user_id, receiver_id: otherUser_id })))
        
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