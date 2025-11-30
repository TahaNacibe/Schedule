import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile } from "@/contexts/ProfileContext";
import { Users, UserPlus, UserCheck, UserX, X } from "lucide-react";
import { useState } from "react";

interface FriendItemProps {
  profile: Profile;
  variant: 'friend' | 'request';
  onAccept?: (profile: Profile) => void;
  onReject?: (profile: Profile) => void;
  onRemove?: (profile: Profile) => void;
}

const FriendItem: React.FC<FriendItemProps> = ({
  profile,
  variant,
  onAccept,
  onReject,
  onRemove,
}) => {
  const defaultPhoto =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";

  return (
    <div className="flex items-center justify-between p-2 py-3 border-b hover:bg-accent transition-colors">
      <div className="flex items-center gap-4">
        <img
          src={profile.photo_URL || defaultPhoto}
          alt={profile.user_name}
          className="w-12 h-12 rounded-full bg-background border border-border object-cover"
        />
        <div>
          <h3 className="font-semibold text-foreground">{profile.user_name}</h3>
          <p className="text-sm text-muted-foreground">{profile.user_id}</p>
        </div>
      </div>
      {variant === "friend" ? (
        <Button variant="outline" size="sm" onClick={() => onRemove?.(profile)}>
          <UserX className="w-4 h-4 mr-2" />
          Remove
        </Button>
      ) : (
        <div className="flex gap-2 pr-4">
          <Button size="sm" onClick={() => onAccept?.(profile)}>
            <UserCheck className="w-4 h-4 text-background!" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onReject?.(profile)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default function FriendsSection() {
    const {getFriendsList,
        getRequestsList,
        updateFriendsList,
        updateRequestsList,} = useProfile();
    const [activeTab, setActiveTab] = useState<"friends" | "requests">(
      "friends"
    );
    const tabWidth = "50%";
    const indicatorLeft = activeTab === "friends" ? "0%" : "50%";

    const handleAcceptRequest = (requestProfile: Profile): void => {
      updateFriendsList([...getFriendsList(), requestProfile]);
      updateRequestsList(
        getRequestsList().filter(
          (req) => req.user_id !== requestProfile.user_id
        )
      );
    };

    const handleRejectRequest = (requestProfile: Profile): void => {
      updateRequestsList(
        getRequestsList().filter(
          (req) => req.user_id !== requestProfile.user_id
        )
      );
    };

    const handleRemoveFriend = (friendProfile: Profile): void => {
      updateFriendsList(
        getFriendsList().filter(
          (friend) => friend.user_id !== friendProfile.user_id
        )
      );
    };

    

    return (
      <div className="flex-1 border-l border-t bg-card flex flex-col pt-7">
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "friends" | "requests")
          }
          className="flex flex-col h-full"
        >
          <div className="relative w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 relative">
              <TabsTrigger
                value="friends"
                className="flex-1 rounded-none data-[state=active]:bg-transparent p-6 data-[state=active]:shadow-none"
              >
                <Users className="w-4 h-4 mr-2" />
                Friends
                <Badge variant="secondary" className="">
                  {getFriendsList().length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-none p-6 data-[state=active]:shadow-none"
              >
                <UserPlus className="w-4 h-4" />
                Requests
                {getRequestsList().length > 0 && (
                  <Badge variant="destructive" className="">
                    {getRequestsList().length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            {/* Sliding Indicator */}
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ease-out"
              style={{
                width: tabWidth,
                left: indicatorLeft,
                transform: "translateX(0)",
              }}
            />
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="friends" className="mt-0 border-t-0 p-0">
              {getFriendsList().length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No friends yet
                </p>
              ) : (
                <div className="divide-y">
                  {getFriendsList().map((friend) => (
                    <FriendItem
                      key={friend.user_id}
                      profile={friend}
                      variant="friend"
                      onRemove={handleRemoveFriend}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="requests" className="mt-0 border-t-0 p-0">
              {getRequestsList().length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending requests
                </p>
              ) : (
                <div className="divide-y">
                  {getRequestsList().map((request) => (
                    <FriendItem
                      key={request.user_id}
                      profile={request}
                      variant="request"
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    );
}