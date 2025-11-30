interface Profile {
    user_name: string,
    user_id: string,
    photo_URL: string | undefined,
    cover_URL: string | undefined,
    bio: string,
    state: "PENDING" | "ACCEPTED" | null
    searchKeyWords: string[]
    
}

interface Friend {
    user_name: string,
    user_id: string,
    photo_URL: string | undefined,
    cover_URL: string | undefined,
    bio: string,
    state: "PENDING" | "ACCEPTED" | null
}