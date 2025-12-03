import { useImageUpload } from "@/hooks/use_image_upload";
import { useProfileUpdate } from "@/hooks/use_profile_updater";
import { CoverImage } from "../components/profile/cover_image";
import { ProfileAvatar } from "../components/profile/profile_avatar";
import { ProfileHeader } from "../components/profile/profile_header";



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
      return;
    }
    
    await updateProfilePhoto(imageUrl);
  };

  const handleUpdateProfileCover = async () => {
    setIsCoverImageUpdating(true);
    const imageUrl = await handleSelectFile("COVER");
    
    if (!imageUrl) {
      setIsCoverImageUpdating(false);
      return;
    }
    
    await updateCoverPhoto(imageUrl);
  };

  return (
    <div className=" overflow-y-auto w-full">
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