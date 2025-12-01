import { useImageUpload } from "@/hooks/use_image_upload";
import { useProfileUpdate } from "@/hooks/use_profile_updater";
import { CoverImage } from "../components/cover_image";
import { ProfileAvatar } from "../components/profile_avatar";
import { ProfileHeader } from "../components/profile_header";


const DEFAULT_PHOTO = "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";

export function ProfileSection({profile, isLocalProfile}:{profile:Profile,isLocalProfile:boolean}) {  
  const { handleSelectFile } = useImageUpload();
  const {
    selectedProfileImage,
    isProfileImageUpdating,
    setIsProfileImageUpdating,
    selectedCoverImage,
    isCoverImageUpdating,
    setIsCoverImageUpdating,
    updateProfilePhoto,
    updateCoverPhoto,
  } = useProfileUpdate();


  const handleUpdateProfilePhoto = async () => {
    setIsProfileImageUpdating(true);
    const imageUrl = await handleSelectFile("PROFILE");
    
    if (!imageUrl) {
      setIsProfileImageUpdating(false);
      console.log("error");
      return;
    }
    
    await updateProfilePhoto(imageUrl);
  };

  const handleUpdateProfileCover = async () => {
    setIsCoverImageUpdating(true);
    const imageUrl = await handleSelectFile("COVER");
    
    if (!imageUrl) {
      setIsCoverImageUpdating(false);
      console.log("error");
      return;
    }
    
    await updateCoverPhoto(imageUrl);
  };

  return (
    <div className="flex-4 overflow-y-auto w-full">
      <CoverImage
        isLocalProfile={isLocalProfile}
        coverUrl={profile ? profile.cover_URL : null}
        selectedImage={selectedCoverImage}
        isUpdating={isCoverImageUpdating}
        onUpdate={handleUpdateProfileCover}
      />

      <div className="bg-card border-none -mt-20 rounded-lg pb-12 pl-16 pr-4">
        <ProfileAvatar
          isLocalProfile={isLocalProfile}
          photoUrl={profile ? profile.photo_URL : null}
          userName={profile ? profile.user_name : "TempUser"}
          selectedImage={selectedProfileImage}
          isUpdating={isProfileImageUpdating}
          onUpdate={handleUpdateProfilePhoto}
          defaultPhoto={DEFAULT_PHOTO}
        />

        <ProfileHeader
          isLocalProfile={isLocalProfile}
          userName={profile ? profile.user_name : "TempUser"}
          bio={profile ? profile.bio : "bio"}
        />
      </div>
    </div>
  );
}