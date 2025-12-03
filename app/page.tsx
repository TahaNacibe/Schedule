"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useMemo } from "react";
import { useProfile } from "@/contexts/ProfileContext";
import ProfilePage from "./home/page";
import LoadingSpinner from "@/components/costume/loading_spinner";
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [isProfileReady, setIsProfileReady] = useState(false)
  const { fetchUserProfile, userProfile } = useProfile();  // Assuming profile is exposed from context

  const handleLoadProfile = useMemo(() => async () => {
    // Skip if profile is already loaded (memoized check)
    if (userProfile) {
      setIsProfileReady(true);
      return;
    }

    const res = await fetchUserProfile()
    if (res.success) {
      setIsProfileReady(true)
    }
    
    if(isProfileReady && !res.success) {
      // redirect into error
      router.push('/error');
    }
  }, [fetchUserProfile, userProfile, isProfileReady, router]);  // Dependencies for memoization

  useEffect(() => {
    handleLoadProfile()
  }, [user, handleLoadProfile])  // Include memoized handler in deps

  if (!isProfileReady) {
    return (
      <div className="w-screen h-screen z-50 bg-background flex items-center justify-center gap-4 flex-col absolute">
        <LoadingSpinner size="w-14 h-14" />
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-2xl">
          <span className="text-xl text-gray-600">Loading your </span>  extensions <span className="text-xl text-gray-600">and</span> profile...
        </h1>
        <p className="text-sm">This may take a moment</p>
        </div>
      </div>
    )
  }

  return (
    <ProfilePage />
  );
}