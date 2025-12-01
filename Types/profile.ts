interface Profile {
    user_name: string,
    user_id: string,
    photo_URL: string | undefined,
    cover_URL: string | undefined,
    bio: string,
    profile_visibility: boolean
    friends_visibility: boolean 
    state?: "PENDING" | "ACCEPTED" | null
    searchKeyWords?: string[]
    
}

interface Friend {
    user_name: string,
    user_id: string,
    photo_URL: string | undefined,
    cover_URL: string | undefined,
    bio: string,
    friends_visibility: boolean 
    profile_visibility: boolean
    state: "PENDING" | "ACCEPTED" | null
}