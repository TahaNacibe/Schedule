"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  clearUserDataFromDB,
  deleteDataFromDB,
  readDataFromDB,
  updateDataToDB,
  writeDataToDB,
} from "@/middleware/firebase_middleware";
import Auth from "./components/auth/auth";
import { useAppAPI } from "@/contexts/AppAPI";
import { useAuth } from "@/hooks/useAuth";
import { updateCurrentUser, updateProfile } from "firebase/auth";

/* eslint-disable react/no-unescaped-entities */
export default function Home() {
  const { user } = useAuth();
  const handleCreate = async ({
    ext_id,
    collection_name,
    user_id,
    payload,
  }: {
    ext_id: string;
    collection_name: string;
    user_id: string;
    payload: any;
  }) => {
    const res = await writeDataToDB({
      ext_id,
      collection_name,
      user_id,
      payload,
    });
    console.log(res);
  };

  const handleRead = async ({
    ext_id,
    collection_name,
    user_id,
    target_id,
  }: {
    ext_id: string;
    collection_name: string;
    user_id: string;
    target_id: string | null;
  }) => {
    const res = await readDataFromDB({
      collection_name,
      ext_id,
      user_id,
      fetch_count: null,
      target_id: target_id,
      order_by: "asc",
    });
    console.log(res);
  };

  const handleDelete = async ({
    ext_id,
    collection_name,
    user_id,
    target_id,
  }: {
    ext_id: string;
    collection_name: string;
    user_id: string;
    target_id: string;
  }) => {
    const res = await deleteDataFromDB({
      ext_id,
      collection_name,
      user_id,
      target_id,
    });
    console.log(res);
  };

  const handleClear = async ({
    ext_id,
    collection_name,
    user_id,
  }: {
    ext_id: string;
    collection_name: string;
    user_id: string;
  }) => {
    const res = await clearUserDataFromDB({ ext_id, collection_name, user_id });
    console.log(res);
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <Auth />
      {/* experimental area  */}
      <div className="flex gap-2 justify-center items-center w-full h-full">
        <button
          onClick={async () =>
            await updateProfile(user!, {
              photoURL:
                "https://i.pinimg.com/736x/8d/5e/c5/8d5ec5e06b8550c27d219a6ca4e626b9.jpg",
            })
          }
          className="rounded-full border-2 border-dashed px-2 py-1"
        >
          create data for extension names test 1
        </button>
        <button
          onClick={async () =>
            await handleClear({
              ext_id: "test-2",
              collection_name: "notes-test-1",
              user_id: user ? user.uid + "5" : "temp-user",
            })
          }
          className="rounded-full border-2 border-dashed px-2 py-1"
        >
          create data for extension names test 2
        </button>
      </div>
    </div>
  );
}
