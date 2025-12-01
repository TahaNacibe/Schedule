import { Badge } from "@/components/ui/badge";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserPlus } from "lucide-react";

interface FriendsTabListProps {
    friendsCount: number;
    requestsCount: number;
    activeTab: "friends" | "requests";
}

export function FriendsTabList({ friendsCount, requestsCount, activeTab }: FriendsTabListProps) {
    return (
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 relative">
            <TabsTrigger
                value="friends"
                className="flex-1 rounded-none data-[state=active]:bg-transparent p-6 data-[state=active]:shadow-none"
            >
                <Users className="w-4 h-4" />
                Friends
                <Badge variant="secondary">{friendsCount}</Badge>
            </TabsTrigger>
            <TabsTrigger
                value="requests"
                className="flex-1 rounded-none data-[state=active]:bg-transparent p-6 data-[state=active]:shadow-none"
            >
                <UserPlus className="w-4 h-4" />
                Requests
                <Badge variant={requestsCount > 0 ? "destructive" : "outline"}>{requestsCount}</Badge>
            </TabsTrigger>
            <TabIndicator activeTab={activeTab} />
        </TabsList>
    );
}

interface TabIndicatorProps {
    activeTab: "friends" | "requests";
}

function TabIndicator({ activeTab }: TabIndicatorProps) {
    const tabWidth = "50%";
    const indicatorLeft = activeTab === "friends" ? "0%" : "50%";

    return (
        <div
            className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
            style={{
                width: tabWidth,
                left: indicatorLeft,
                transform: "translateX(0)",
            }}
        />
    );
}