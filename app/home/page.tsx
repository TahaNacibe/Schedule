"use client"

import { ProfileSection } from '../components/sections/profile_section';
import FriendsSection from '../components/sections/friends_section';





export default function ProfilePage(){
  
return (
  <div className="h-[99%] w-screen bg-background flex overflow-hidden">
    <ProfileSection/>
    <FriendsSection/>
  </div>
)
  
};

