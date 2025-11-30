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
import { useEffect, useState } from "react";
import cloudinaryMiddleware from "@/middleware/cloudinary_middleware";
import { auth } from "@/lib/firebase";
import { createDocInAnotherExtensionCollection, deleteDataFromAnotherExt, readDataFromAnotherExt, updateDataInAnotherExtData } from "@/middleware/inter_extension_middleware";
import { useProfile } from "@/contexts/ProfileContext";



export default function Home() {
  const { user } = useAuth();
  const { fetchUserProfile } = useProfile();
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  

  const testUnite = async () => {
    const state = await createDocInAnotherExtensionCollection({
      targetExt_id: "test-1",
      targetExt_allowList: [{id:  "test-unite", permission: "READ-WRITE"}],
      activeExt_id: "test-unite",
      user_id: user?.uid ?? "TempUser",
      collection_name: "journals",
      payload: {
        "something": "kjshdfkjsfjdfs"
      }
    })
    console.log(state)
  }

  useEffect(() => {
    fetchUserProfile()
  },[user])

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
