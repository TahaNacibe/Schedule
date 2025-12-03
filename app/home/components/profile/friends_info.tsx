interface FriendInfoProps {
    userName: string;
}

export function FriendInfo({ userName }: FriendInfoProps) {
    return (
        <div>
        <h3 className="font-semibold text-foreground">{userName}</h3>
        <p className="text-sm text-muted-foreground">@{userName.toLowerCase().replaceAll(" ","")}</p>
        </div>
    );
}