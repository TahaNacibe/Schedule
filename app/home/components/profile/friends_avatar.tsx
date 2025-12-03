interface FriendAvatarProps {
    photoUrl?: string;
    userName: string;
    size?: "sm" | "md" | "lg";
}

const SIZES = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-16 h-16",
};



export function FriendAvatar({ photoUrl, userName, size = "md" }: FriendAvatarProps) {
    return (
        (photoUrl != null)
        ? <img
            src={photoUrl!}
            alt={userName}
                className={`${SIZES[size]} rounded-full object-cover top-0`} />
        
        : <div className={`${SIZES[size]} rounded-full object-cover top-0 
            bg-accent
            flex items-center justify-center`}>
                <h1 className="text-5xl font-semibold">
                {userName.slice(0,2).toUpperCase()}            
                </h1>
            </div>
                
    );
}