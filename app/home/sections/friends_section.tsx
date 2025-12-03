import { useState } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useFriendsManagement } from "@/hooks/user_friends_managements";
import { UserPlus, Users } from "lucide-react";
import SearchDialog from "../dialogs/search_dialog";
import EmptyListPlaceHolder from "../components/profile/empty_list_placeholder";
import { FriendsList } from "../components/profile/friends_list";
import { FriendsTabList } from "../components/profile/friends_tabList";
import { RequestsList } from "../components/profile/requests_list";


export default function FriendsSection() {
  const [activeTab, setActiveTab] = useState<"friends" | "requests">("friends");
  const {
    friends,
    requests,
    handleAcceptRequest,
    handleRejectRequest,
    handleRemoveFriend,
  } = useFriendsManagement();

  return (
    <div className="w-2/4 lg:w-1/4 border-l border-t border-accent bg-card lg:flex flex-col pt-2 hidden">
      <div className="pt-0.5 pb-1 px-2">
        <SearchDialog />
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "friends" | "requests")}
        className="flex flex-col h-full"
      >
        <div className="relative">
          <FriendsTabList
            friendsCount={friends.length}
            requestsCount={(requests.users ?? []).length}
            activeTab={activeTab}
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="friends" className="mt-0 border-t-0 p-0">
            {friends.length == 0
              ? <EmptyListPlaceHolder list_name="Friends" Icon={Users} />
              : <FriendsList friends={friends} onRemove={handleRemoveFriend} />}
          </TabsContent>

          <TabsContent value="requests" className="mt-0 border-t-0 p-0">
            {(requests.users ?? []).length == 0
              ? <EmptyListPlaceHolder list_name="Requests" Icon={UserPlus} />
              : <RequestsList
              requests={requests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}