'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming shadcn/ui
import { Users, UserPlus, UserX, UserCheck, X, Badge, Button } from 'lucide-react'; // Icons
// Import other hooks/components as needed (e.g., updateProfile, handleRemoveFriend, etc.)

export default function FriendsTab() {
  const [activeTab, setActiveTab] = useState('friends');

  const tabWidth = '50%'; // Assume equal width for simplicity; adjust if needed
  const indicatorLeft = activeTab === 'friends' ? '0%' : '50%';

  return (
    <div className="bg-card h-screen border-l">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="relative w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 relative">
            <TabsTrigger 
              value="friends" 
              className="flex-1 rounded-none data-[state=active]:bg-transparent px-6 py-4 data-[state=active]:shadow-none"
            >
              <Users className="w-4 h-4 mr-2" />
              Friends
              <Badge variant="secondary" className="ml-2">{friends.length}</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="requests" 
              className="flex-1 rounded-none data-[state=active]:bg-transparent px-6 py-4 data-[state=active]:shadow-none"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Requests
              {friendRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2">{friendRequests.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          {/* Sliding Indicator */}
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ease-out"
            style={{ 
              width: tabWidth, 
              left: indicatorLeft,
              transform: 'translateX(0)' // Smooth slide
            }}
          />
        </div>

        {/* Friends List */}
        <TabsContent value="friends" className="p-6 mt-0 border-t-0">
          {friends.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No friends yet</p>
          ) : (
            <div className="space-y-4">
              {friends.map((friend) => (
                <div 
                  key={friend.user_id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={friend.photo_URL || defaultPhoto} 
                      alt={friend.user_name}
                      className="w-12 h-12 rounded-full bg-background border border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{friend.user_name}</h3>
                      <p className="text-sm text-muted-foreground">{friend.user_id}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleRemoveFriend(friend)}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Friend Requests */}
        <TabsContent value="requests" className="p-6 mt-0 border-t-0">
          {friendRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No pending requests</p>
          ) : (
            <div className="space-y-4">
              {friendRequests.map((request) => (
                <div 
                  key={request.user_id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={request.photo_URL || defaultPhoto} 
                      alt={request.user_name}
                      className="w-12 h-12 rounded-full bg-background border border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{request.user_name}</h3>
                      <p className="text-sm text-muted-foreground">{request.user_id}</p>
                      <p className="text-sm text-muted-foreground mt-1">{request.bio}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleAcceptRequest(request)}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectRequest(request)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}