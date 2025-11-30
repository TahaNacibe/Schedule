"use client"
import React, { useState } from 'react';
import { Camera, Edit2, Save, X, UserPlus, UserCheck, UserX, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface FriendItemProps {
  profile: Profile;
  variant: 'friend' | 'request';
  onAccept?: (profile: Profile) => void;
  onReject?: (profile: Profile) => void;
  onRemove?: (profile: Profile) => void;
}

const FriendItem: React.FC<FriendItemProps> = ({ profile, variant, onAccept, onReject, onRemove }) => {
  const defaultPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default';

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
      {variant === 'friend' ? (
        <Button variant="outline" size="sm" onClick={() => onRemove?.(profile)}>
          <UserX className="w-4 h-4 mr-2" />
          Remove
        </Button>
      ) : (
        <div className="flex gap-2 pr-4">
          <Button size="sm" onClick={() => onAccept?.(profile)}>
            <UserCheck className="w-4 h-4 text-background!" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onReject?.(profile)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedBio, setEditedBio] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');
  const tabWidth = '50%';
  const indicatorLeft = activeTab === 'friends' ? '0%' : '50%';

  const [profile, setProfile] = useState<Profile>({
    user_name: 'Alex Johnson',
    user_id: '@alexjohnson',
    photo_URL: 'https://i.pinimg.com/1200x/b4/47/c1/b447c19bc4ea8b7c5bf1e3bc860f794a.jpg',
    cover_URL: 'https://i.pinimg.com/1200x/db/c4/3c/dbc43cde64bb4c93f61e32bd2370fb79.jpg',
    bio: 'Passionate developer with 8+ years of experience building scalable web applications. Love coding, coffee, and creating amazing user experiences.',
  });

  const [friends, setFriends] = useState<Profile[]>([
    {
      user_name: 'Sarah Miller',
      user_id: '@sarahmiller',
      photo_URL: 'https://i.pinimg.com/736x/30/33/db/3033db8c5a803b9e73bbe005beb31e11.jpg',
      cover_URL: undefined,
      bio: 'UX Designer passionate about creating intuitive interfaces',
    },
    {
      user_name: 'Mike Chen',
      user_id: '@mikechen',
      photo_URL: 'https://i.pinimg.com/736x/55/cc/f4/55ccf4cf94306fb90d8b1d922f5abe2f.jpg',
      cover_URL: undefined,
      bio: 'Full-stack developer and open source enthusiast',
    },
    {
      user_name: 'Emma Davis',
      user_id: '@emmadavis',
      photo_URL: 'https://i.pinimg.com/736x/a9/df/2b/a9df2b9b1e1e482e32bad6147c6809d7.jpg',
      cover_URL: undefined,
      bio: 'Product manager building the future',
    },
    {
      user_name: 'Sarah Miller',
      user_id: '@sarahmiller',
      photo_URL: 'https://i.pinimg.com/736x/30/33/db/3033db8c5a803b9e73bbe005beb31e11.jpg',
      cover_URL: undefined,
      bio: 'UX Designer passionate about creating intuitive interfaces',
    },
    {
      user_name: 'Mike Chen',
      user_id: '@mikechen',
      photo_URL: 'https://i.pinimg.com/736x/55/cc/f4/55ccf4cf94306fb90d8b1d922f5abe2f.jpg',
      cover_URL: undefined,
      bio: 'Full-stack developer and open source enthusiast',
    },
    {
      user_name: 'Emma Davis',
      user_id: '@emmadavis',
      photo_URL: 'https://i.pinimg.com/736x/a9/df/2b/a9df2b9b1e1e482e32bad6147c6809d7.jpg',
      cover_URL: undefined,
      bio: 'Product manager building the future',
    },
    {
      user_name: 'Sarah Miller',
      user_id: '@sarahmiller',
      photo_URL: 'https://i.pinimg.com/736x/30/33/db/3033db8c5a803b9e73bbe005beb31e11.jpg',
      cover_URL: undefined,
      bio: 'UX Designer passionate about creating intuitive interfaces',
    },
    {
      user_name: 'Mike Chen',
      user_id: '@mikechen',
      photo_URL: 'https://i.pinimg.com/736x/55/cc/f4/55ccf4cf94306fb90d8b1d922f5abe2f.jpg',
      cover_URL: undefined,
      bio: 'Full-stack developer and open source enthusiast',
    },
    {
      user_name: 'Emma Davis',
      user_id: '@emmadavis',
      photo_URL: 'https://i.pinimg.com/736x/a9/df/2b/a9df2b9b1e1e482e32bad6147c6809d7.jpg',
      cover_URL: undefined,
      bio: 'Product manager building the future',
    },
    {
      user_name: 'Sarah Miller',
      user_id: '@sarahmiller',
      photo_URL: 'https://i.pinimg.com/736x/30/33/db/3033db8c5a803b9e73bbe005beb31e11.jpg',
      cover_URL: undefined,
      bio: 'UX Designer passionate about creating intuitive interfaces',
    },
    {
      user_name: 'Mike Chen',
      user_id: '@mikechen',
      photo_URL: 'https://i.pinimg.com/736x/55/cc/f4/55ccf4cf94306fb90d8b1d922f5abe2f.jpg',
      cover_URL: undefined,
      bio: 'Full-stack developer and open source enthusiast',
    },
    {
      user_name: 'Emma Davis',
      user_id: '@emmadavis',
      photo_URL: 'https://i.pinimg.com/736x/a9/df/2b/a9df2b9b1e1e482e32bad6147c6809d7.jpg',
      cover_URL: undefined,
      bio: 'Product manager building the future',
    },
    {
      user_name: 'Sarah Miller',
      user_id: '@sarahmiller',
      photo_URL: 'https://i.pinimg.com/736x/30/33/db/3033db8c5a803b9e73bbe005beb31e11.jpg',
      cover_URL: undefined,
      bio: 'UX Designer passionate about creating intuitive interfaces',
    },
    {
      user_name: 'Mike Chen',
      user_id: '@mikechen',
      photo_URL: 'https://i.pinimg.com/736x/55/cc/f4/55ccf4cf94306fb90d8b1d922f5abe2f.jpg',
      cover_URL: undefined,
      bio: 'Full-stack developer and open source enthusiast',
    },
    {
      user_name: 'Emma Davis',
      user_id: '@emmadavis',
      photo_URL: 'https://i.pinimg.com/736x/a9/df/2b/a9df2b9b1e1e482e32bad6147c6809d7.jpg',
      cover_URL: undefined,
      bio: 'Product manager building the future',
    },
  ]);

  const [friendRequests, setFriendRequests] = useState<Profile[]>([
    {
      user_name: 'James Wilson',
      user_id: '@jameswilson',
      photo_URL: 'https://i.pinimg.com/736x/45/67/ff/4567ff3fbcebf9452b7f5512757aa636.jpg',
      cover_URL: undefined,
      bio: 'Software engineer interested in AI and ML',
    },
    {
      user_name: 'Lisa Anderson',
      user_id: '@lisaanderson',
      photo_URL: 'https://i.pinimg.com/736x/dd/35/f0/dd35f0c6c09dc3dc9b353801f4db7a67.jpg',
      cover_URL: undefined,
      bio: 'DevOps engineer | Cloud enthusiast',
    },
    {
      user_name: 'Tom Brown',
      user_id: '@tombrown',
      photo_URL: 'https://i.pinimg.com/736x/c9/58/31/c95831a80e9df9657473f18113f52c33.jpg',
      cover_URL: undefined,
      bio: 'Data scientist exploring machine learning',
    },
  ]);

  const defaultPhoto = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default';

  const handleEdit = (): void => {
    setEditedBio(profile.bio);
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setProfile({ ...profile, bio: editedBio });
    setIsEditing(false);
  };

  const handleCancel = (): void => {
    setIsEditing(false);
  };

  const handleAcceptRequest = (requestProfile: Profile): void => {
    setFriends([...friends, requestProfile]);
    setFriendRequests(friendRequests.filter((req) => req.user_id !== requestProfile.user_id));
  };

  const handleRejectRequest = (requestProfile: Profile): void => {
    setFriendRequests(friendRequests.filter((req) => req.user_id !== requestProfile.user_id));
  };

  const handleRemoveFriend = (friendProfile: Profile): void => {
    setFriends(friends.filter((friend) => friend.user_id !== friendProfile.user_id));
  };

  return (
    <div className="h-[99%] w-screen bg-background flex overflow-hidden">
      {/* Profile Section - Scrolls independently */}
      <div className="flex-4 overflow-y-auto w-full">
        {/* Cover Image */}
        <div className="relative w-full h-72 bg-linear-to-r from-blue-500 to-purple-600 overflow-hidden">
          {profile.cover_URL ? (
            <img src={profile.cover_URL} alt="Cover" className="w-full h-full object-cover" />
          ) : null}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-4 right-4 rounded-full shadow-lg"
          >
            <Camera className="w-4 h-4 mr-2" />
            Update Cover
          </Button>
        </div>

        {/* Profile Content */}
        <div className="bg-card border-none -mt-20 rounded-lg pb-12 pl-16 pr-4">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="relative inline-block">
              <img
                src={profile.photo_URL || defaultPhoto}
                alt={profile.user_name}
                className="w-32 h-32 rounded-full border-6 border-background shadow-xl object-cover"
              />
              <button className="absolute bottom-2 right-1 bg-background p-2 rounded-full shadow-lg hover:bg-accent transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name and Edit Button */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{profile.user_name}</h1>
              <p className="text-muted-foreground mt-1">{profile.user_id}</p>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          {/* Bio */}
          <div className="max-w-2xl">
            <h2 className="text-sm font-semibold text-foreground mb-2">Bio</h2>
            {!isEditing ? (
              <p className="text-muted-foreground leading-relaxed">{profile.bio || 'No bio yet.'}</p>
            ) : (
              <textarea
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none resize-none"
                rows={4}
                placeholder="Write something about yourself..."
              />
            )}
          </div>
        </div>
      </div>

      {/* Friends and Requests Section - Scrolls independently */}
      <div className="flex-1 border-l border-t bg-card flex flex-col pt-7">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'friends' | 'requests')} className="flex flex-col h-full">
          <div className="relative w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 relative">
              <TabsTrigger
                value="friends"
                className="flex-1 rounded-none data-[state=active]:bg-transparent p-6 data-[state=active]:shadow-none"
              >
                <Users className="w-4 h-4 mr-2" />
                Friends
                <Badge variant="secondary" className="">
                  {friends.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="flex-1 rounded-none data-[state=active]:bg-transparent data-[state=active]:border-none p-6 data-[state=active]:shadow-none"
              >
                <UserPlus className="w-4 h-4" />
                Requests
                {friendRequests.length > 0 && (
                  <Badge variant="destructive" className="">
                    {friendRequests.length}
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
                transform: 'translateX(0)',
              }}
            />
          </div>

          {/* Scrollable Tab Content */}
          <div className="flex-1 overflow-y-auto">
            <TabsContent value="friends" className="mt-0 border-t-0 p-0">
              {friends.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No friends yet</p>
              ) : (
                <div className="divide-y">
                  {friends.map((friend) => (
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
              {friendRequests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending requests</p>
              ) : (
                <div className="divide-y">
                  {friendRequests.map((request) => (
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
    </div>
  );
};

export default ProfilePage;