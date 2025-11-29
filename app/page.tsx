"use client";
import {
  clearUserDataFromDB,
  deleteDataFromDB,
  readDataFromDB,
  writeDataToDB,
} from "@/middleware/firebase_middleware";
import Auth from "./components/auth/auth";
import { useAppAPI } from "@/contexts/AppAPI";
import { useAuth } from "@/hooks/useAuth";
import { updateCurrentUser, updateProfile } from "firebase/auth";
import { useState } from "react";
import cloudinaryMiddleware from "@/middleware/cloudinary_middleware";
import { auth } from "@/lib/firebase";
import { createDocInAnotherExtensionCollection, deleteDataFromAnotherExt, readDataFromAnotherExt, updateDataInAnotherExtData } from "@/middleware/inter_extension_middleware";



export default function Home() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const handleSelectFile = async () => {
    const path = await window.electronAPI!.selectFile(); // IPC call
    if (path) {
      setSelectedFile(path);
      console.log("path is : " + path)
      const res = await cloudinaryMiddleware({
        file_path: path,
        ext_id: "MAIN-APP"
      })

      if (res.success) {
  const photoURL = res.data;
  if (!photoURL) return; // Guard

  // Update Firebase profile (uses auth.currentUser internally)
  await updateProfile(auth.currentUser!, { photoURL });

  // If updateCurrentUser is for app state (e.g., Redux/Zustand), pass the Firebase user or updated state
  updateCurrentUser(auth, auth.currentUser!)
}
    }
  };

  const testUnite = async () => {
    const state = await deleteDataFromAnotherExt({
      targetExt_id: "test-1",
      targetExt_allowList: [{id:  "test-unite", permission: "READ-WRITE"}],
      activeExt_id: "test-unite",
      user_id: user?.uid ?? "TempUser",
      collection_name: "journals",
      targetItem_id: "5qcSHy5cPhilBGqLo6zH",
    })
    console.log(state)
  }

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Auth />
      {/* experimental area  */}
        <button
        className="border-2 border-dashed border-white mt-8 w-24"
        onClick={testUnite}
      >
        Test unite
      </ button>
    </div>
  );
}
