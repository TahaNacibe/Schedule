import EditProfileDialog from "../../dialogs/edit_profile_dialog";


interface ProfileHeaderProps {
    isLocalProfile: boolean;
    userName: string;
    bio: string;

}

export function ProfileHeader({
    isLocalProfile,
    userName,
    bio,
}: ProfileHeaderProps) {
    const username = userName.toLowerCase().replaceAll(" ", "");
    
    return (
        <div className="ml-4">
            <div className="flex items-start justify-between mb-4">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{userName}</h1>
                <p className="text-muted-foreground mt-1">@{username}</p>
            </div>
            
            {isLocalProfile && <EditProfileDialog userName={userName} bio={bio}/>}
            </div>
            <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line">
            {bio || "No bio yet."}
            </p>
        </div>
        );
}