import { ERROR_COMPLETING_TASK, MISSING_REQUIRED_ARGUMENT, TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR } from "@/lib/errors_handlers";
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { createPublicUser, fetchUsersProfiles } from "./firebase_services";

interface HandleAuthWithEmailAndPassword {
    auth: Auth,
    email: string | null,
    password: string | null,
    displayName?: string | null
}

async function handleSignInWithEmailAndPassword({
    auth, email, password
}: HandleAuthWithEmailAndPassword) {
    if (!auth || !email || !password)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        if (res.user) {
            const profile = await fetchUsersProfiles({
                user_ids: [res.user.uid],
                currentUser_id: res.user.uid
            })
            if(profile.success)
                return TASK_COMPLETED_SUCCESSFULLY(profile.data)
        }

        return UNKNOWN_ERROR
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}


async function handleSignUpWithEmailAndPassword({
    auth, email, password, displayName
}: HandleAuthWithEmailAndPassword) {
    if (!auth || !email || !password || !displayName)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const res = await createUserWithEmailAndPassword(auth, email, password)
        if (res.user) {
            await updateProfile(res.user, {
                displayName: displayName
            })
            const profile = await createPublicUser({
                user_name: displayName,
                user_id: res.user.uid,
                photo_URL: "null",
                cover_URL: "null",
                bio: "",
                profile_visibility: true,
                friends_visibility: true
            })
            if(profile.success)
                return TASK_COMPLETED_SUCCESSFULLY(profile.data)
        }

        return UNKNOWN_ERROR
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}


async function handleSignOut(auth:Auth) {
    try {
        await signOut(auth)
        return TASK_COMPLETED_SUCCESSFULLY(null)
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}


export {
    handleSignInWithEmailAndPassword,
    handleSignUpWithEmailAndPassword,
    handleSignOut
}