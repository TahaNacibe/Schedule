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

const DEFAULT_PHOTO = "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";

export function FriendAvatar({ photoUrl, userName, size = "md" }: FriendAvatarProps) {
    return (
        <img
        src={photoUrl || DEFAULT_PHOTO}
        alt={userName}
        className={`${SIZES[size]} rounded-full bg-background border border-border object-cover`}
        />
    );
}