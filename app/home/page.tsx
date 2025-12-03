"use client"
import { ProfileSection } from './sections/profile_section';
import FriendsSection from './sections/friends_section';
import { useProfile } from '@/contexts/ProfileContext';
import SettingsSection from './sections/settings_section';
import DevelopersSection from './sections/developers_section';


export default function ProfilePage() {
    const { userProfile } = useProfile();
  
return (
  <div className="w-screen bg-background flex overflow-y-hidden">
    <div className='h-screen overflow-y-scroll w-screen lg:w-3/4'>
    <ProfileSection profile={userProfile!} isLocalProfile={ true } />
    <SettingsSection />
    <DevelopersSection />
    </div>
    <FriendsSection />
  </div>
)
  
};

