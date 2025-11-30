import { Button } from "@/components/ui/button";
import { useProfile } from "@/contexts/ProfileContext";
import { useAuth } from "@/hooks/useAuth";
import cloudinaryMiddleware from "@/middleware/cloudinary_middleware";
import { updatePublicUser } from "@/services/firebase_services";
import { updateProfile } from "firebase/auth";
import { Camera, Edit2, Save, X } from "lucide-react";
import { useState } from "react";

export function ProfileSection() {
  const {getCurrentUserProfile,updateCurrentUser} = useProfile();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedBio, setEditedBio] = useState<string>('');
    const {user} = useAuth();
    
  const defaultPhoto =
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Default";


    const handleEdit = (): void => {
      setEditedBio(getCurrentUserProfile()!.bio);
      setIsEditing(true);
    };

    const handleSave = async (): Promise<void> => {
    if(!user) return;
      updateCurrentUser({
        ...getCurrentUserProfile()!,
        bio: editedBio,
      });
      await updatePublicUser({user_id:user!.uid , 
        profile:{...getCurrentUserProfile()!,bio:editedBio},
    user
    }),
      setIsEditing(false);
    };

    const handleCancel = (): void => {
      setIsEditing(false);
    };

    const handleSelectFile = async () => {
      const path = await window.electronAPI!.selectFile(); // IPC call
      if (path) {
        console.log("path is : " + path);
        const res = await cloudinaryMiddleware({
          file_path: path,
          ext_id: "MAIN-APP",
        });

        console.log(res)
        if (res.success) {
          const photoURL = res.data;
          if (!photoURL) return; // Guard
          return photoURL;
        }
        return null
      }
    };

    const handleUpdateProfilePhoto = async ()=> {
        const image_url = await handleSelectFile()
        console.log("----------------->" + image_url)
        console.log("user -------> " + user)
        if(!image_url || !user){
            console.log("error")
            return;
        }
        await updateProfile(user,{photoURL:image_url})
        await updatePublicUser({user_id:user.uid,profile:{
            ...getCurrentUserProfile()!,
            photo_URL: image_url
        },user}),
        
        updateCurrentUser({
            ...getCurrentUserProfile()!,
            photo_URL: image_url
        })
    }

    const handleUpdateProfileCover = async () => {
      const image_url = await handleSelectFile();
      if (!image_url || !user) {
        console.log("error");
        return;
      }
      await updatePublicUser({user_id:user.uid,profile:{
            ...getCurrentUserProfile()!,
            cover_URL: image_url
        },user}),
      updateCurrentUser({
        ...getCurrentUserProfile()!,
        cover_URL: image_url,
      });
    };
  

    {/* Profile Section - Scrolls independently */}
  return (
    <div className="flex-4 overflow-y-auto w-full">
      {/* Cover Image */}
      <div className="relative w-full h-72 bg-linear-to-r from-blue-500 to-purple-600 overflow-hidden">
        {getCurrentUserProfile()!.cover_URL ? (
          <img
            src={getCurrentUserProfile()!.cover_URL}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : null}
        <Button
          onClick={handleUpdateProfileCover}
          variant="secondary"
          size="sm"
          className="absolute bottom-4 right-4 rounded-full shadow-lg cursor-pointer z-20"
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
              src={getCurrentUserProfile()!.photo_URL || defaultPhoto}
              alt={getCurrentUserProfile()!.user_name}
              className="w-32 h-32 rounded-full border-6 border-background shadow-xl object-cover"
            />
            <button
              onClick={handleUpdateProfilePhoto}
              className="absolute bottom-2 right-1 bg-background p-2 rounded-full shadow-lg hover:bg-accent transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Name and Edit Button */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {getCurrentUserProfile()!.user_name}
            </h1>
            <p className="text-muted-foreground mt-1">
              @
              {getCurrentUserProfile()!
                .user_name.toLowerCase()
                .replaceAll(" ", "")}
            </p>
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
            <p className="text-muted-foreground leading-relaxed">
              {getCurrentUserProfile()!.bio || "No bio yet."}
            </p>
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
  );
}
