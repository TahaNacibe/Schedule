import { useState } from "react";
import cloudinaryMiddleware from "@/middleware/cloudinary_middleware";

export function useImageUpload() {
  const handleSelectFile = async (imageFor: "PROFILE" | "COVER") => {
    const path = await window.electronAPI!.selectFile();
    if (!path) return null;

    const res = await cloudinaryMiddleware({
      file_path: path,
      ext_id: "MAIN-APP",
    });

    if (res.success && res.data) {
      return res.data;
    }
    
    return null;
  };

  return { handleSelectFile };
}