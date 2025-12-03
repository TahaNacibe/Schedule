import { useState } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/hooks/useAuth";
import { updatePublicUser } from "@/services/firebase_services";
import { updateProfile } from "firebase/auth";

export function useProfileUpdate() {
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const [isProfileImageUpdating, setIsProfileImageUpdating] = useState(false);
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);
  const [isCoverImageUpdating, setIsCoverImageUpdating] = useState(false);
  
  const { userProfile, updateCurrentUser } = useProfile();
  const { user } = useAuth();

  const updateProfilePhoto = async (imageUrl: string) => {
    if (!user) return;

    setSelectedProfileImage(imageUrl);
    await updateProfile(user, { photoURL: imageUrl });
    
    const updatedProfile = {
      ...userProfile!,
      photo_URL: imageUrl,
    };
    
    await updatePublicUser({
      user_id: user.uid,
      profile: updatedProfile,
      user,
    });
    
    updateCurrentUser(updatedProfile);
    setSelectedProfileImage(null);
    setIsProfileImageUpdating(false);
  };

  const updateCoverPhoto = async (imageUrl: string) => {
    if (!user) return;

    setSelectedCoverImage(imageUrl);
    
    const updatedProfile = {
      ...userProfile!,
      cover_URL: imageUrl,
    };
    
    await updatePublicUser({
      user_id: user.uid,
      profile: updatedProfile,
      user,
    });
    
    updateCurrentUser(updatedProfile);
    setSelectedCoverImage(null);
    setIsCoverImageUpdating(false);
  };

  const updateProfileHeader = async ({bio, userName}:{bio: string, userName:string}) => {
    if (!user) return;

    const updatedProfile = {
      ...userProfile!,
      bio,
      user_name: userName
    };
    
    updateCurrentUser(updatedProfile);
    await updateProfile(user, {displayName: userName})
    await updatePublicUser({
      user_id: user.uid,
      profile: updatedProfile,
      user,
    });
  };

  return {
    selectedProfileImage,
    isProfileImageUpdating,
    setIsProfileImageUpdating,
    selectedCoverImage,
    isCoverImageUpdating,
    setIsCoverImageUpdating,
    updateProfilePhoto,
    updateCoverPhoto,
    updateProfileHeader,
  };
}