"use client"

import { ProfileSection } from './sections/profile_section';
import FriendsSection from './sections/friends_section';
import { useProfile } from '@/contexts/ProfileContext';





export default function ProfilePage() {
    const { userProfile } = useProfile();
  
return (
  <div className="h-[99%] w-screen bg-background flex overflow-y-hidden">
    <ProfileSection profile={userProfile!} isLocalProfile={ true } />
    <FriendsSection/>
  </div>
)
  
};

