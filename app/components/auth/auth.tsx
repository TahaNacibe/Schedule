"use client";
import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { useAppAPI } from "@/contexts/AppAPI";

export default function Auth() {
  const { user, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState<string | null>(null);
  const { setUserId, setUserSignedIn } = useAppAPI();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setUserSignedIn(true);
      setUserId(user?.uid ?? null);
    } catch (err) {
      console.log(err);
      setSignInError((err as Error).message || "Sign-in failed");
      setUserSignedIn(false);
      setUserId(null);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      await updateProfile(newUser, {
        displayName: "Raizer",
        photoURL:
          "https://i.pinimg.com/736x/38/08/7b/38087bb8ba16981f280a3bda0bf0a1f5.jpg",
      });
      setUserSignedIn(true);
      setUserId(user?.uid ?? null);
    } catch (err) {
      console.log(err);
      setSignInError((err as Error).message || "Sign-in failed");
      setUserSignedIn(false);
      setUserId(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUserSignedIn(false);
      setUserId(null);
    } catch (error) {
      console.log(error);
      setSignInError((error as Error).message || "Sign-in failed");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex justify-center items-center flex-col gap-4">
        <div className="rounded-full w-24 h-24">
          <img src={user.photoURL!} alt="" className="w-24 h-24 rounded-full border-3 border-black dark:border-white" />
        </div>
        <p className="text-3xl font-semibold">Welcome Back {user.displayName} </p>
        <p className="text-base font-sm">
          this time let's keep up the work
        </p>
        <button className="border-dashed border-black dark:border-white border-2 rounded-sm px-4 py-2" onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignIn}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Sign In</button>
      {signInError && <p style={{ color: "red" }}>{signInError}</p>}
      {error && <p style={{ color: "red" }}>Auth error: {error.message}</p>}
    </form>
  );
}
