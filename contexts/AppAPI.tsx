"use client"
import { makeApiRequest } from '@/middleware/api_middleware';
import { clearUserDataFromDB, deleteDataFromDB, readDataFromDB, updateDataInDB, writeDataToDB } from '@/middleware/firebase_middleware';
import { createDocInAnotherExtensionCollection, deleteDataFromAnotherExt, readDataFromAnotherExt, updateDataInAnotherExtData } from '@/middleware/inter_extension_middleware';
import { fetchUsersListBasedOnState, fetchUsersProfiles } from '@/services/firebase_services';
import { Method } from 'axios';
import React, { createContext, useContext } from 'react';



/**
* Make an HTTP request to an external endpoint.
* @param {string} endpoint - URL to request.
* @param {Uppercase<Method>} request_type - HTTP method (GET, POST, PUT, DELETE, etc.).
* @param {any} [data] - Optional payload for POST/PUT requests.
* @returns {Promise<CustomResponse>} Response wrapper.
*/
type ExternalAPIRequest = {
  requestExternalUrl: (endpoint: string,
      request_type: Uppercase<Method>,
      data?: any) => Promise<CustomResponse>
}


type SocialAPI = {
  requestUsersFriendList: (user_id: string) => Promise<CustomResponse>
  requestUserProfile: (user_id: string) => Promise<CustomResponse>
}


type FirebaseControlAPI = {
  requestWritingDataIntoDb: <T = unknown>(
  ext_id: string,
  collection_name: string,
  user_id: string,
  payload: T,
  ) => Promise<CustomResponse>

  requestFetchDataFromDb: (
  collection_name: string,
  ext_id: string,
  user_id: string,
  fetch_count: number | null,
  target_id: string | null,
  order_by: "desc" | "asc"
  ) => Promise<CustomResponse>

  requestUpdatingDataInDb: <T = unknown> (
  collection_name: string,
  user_id: string,
  ext_id: string,
  target_id: string,
  payload: T
  ) => Promise<CustomResponse>

  requestDeleteDataFromDb: (
  collection_name: string,
  ext_id: string,
  user_id: string,
  target_id: string,
  ) => Promise<CustomResponse>

  requestClearDataFromDb: (
  collection_name: string,
  ext_id: string,
  user_id: string
  ) => Promise<CustomResponse>
}





//* interconnected extensions
type InterConnectionAPI = {
  requestWritingDataIntoDb: <T = unknown>(
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[],
    activeExt_id: string,
    user_id: string,
    collection_name: string,
    payload: T
  ) => Promise<CustomResponse>

  requestUpdatingDatInDb: <T = unknown> (
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[],
    collection_name: string,
    user_id: string,
    activeExt_id: string,
    targetItem_id: string,
    payload: T,
  ) => Promise<CustomResponse>

  requestFetchDataFromDb: (
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[],
    collection_name: string,
    activeExt_id: string,
    user_id: string,
    fetch_count: number | null,
    targetItem_id: string | null,
    order_by: "desc" | "asc",
  ) => Promise<CustomResponse>

  requestDeleteDataFromDb: (
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[],
    collection_name: string,
    activeExt_id: string,
    user_id: string,
    targetItem_id: string,
  ) => Promise<CustomResponse>  
}


/**
 * Provides access to all APIs (external, Firebase, inter-extension) for extensions.
 * Wrap your app with this provider to allow API usage.
 */
type AppContextType = {
  externalApi: ExternalAPIRequest,
  storageApi: FirebaseControlAPI,
  externalExtensionApi: InterConnectionAPI,
  socialApi: SocialAPI
}


const AppAPIContext = createContext<AppContextType | undefined>(undefined);

export function AppAPIProvider({ children }: { children: React.ReactNode }) {

  //? ------------- External API REQUESTS --------------------
  const externalApi: ExternalAPIRequest = {
    requestExternalUrl: async (endpoint: string,
      request_type: Uppercase<Method>,
    data?: any) => await makeApiRequest(endpoint, request_type, data)
  }



  //? --------------- FIREBASE CONTROL API ---------------
  const storageApi: FirebaseControlAPI = {
    // POST
    requestWritingDataIntoDb: async <T = unknown>(
    ext_id: string,
    collection_name: string,
    user_id: string,
    payload: T,
    ) => await writeDataToDB({
      ext_id, collection_name, user_id, payload
    }),

    // GET
    requestFetchDataFromDb: async (
    collection_name: string,
    ext_id: string,
    user_id: string,
    fetch_count: number | null,
    target_id: string | null,
    order_by: "desc" | "asc"
    ) => await readDataFromDB({collection_name, ext_id, user_id, fetch_count, target_id, order_by}),
    
    // PUT
    requestUpdatingDataInDb: async <T = unknown> (
    collection_name: string,
    user_id: string,
    ext_id: string,
    target_id: string,
    payload: T
    ) =>  await updateDataInDB({collection_name, user_id, ext_id, target_id, payload}),

    // DELETE
    requestDeleteDataFromDb: async (
    collection_name: string,
    ext_id: string,
    user_id: string,
    target_id: string,
    ) => await deleteDataFromDB({collection_name, ext_id, user_id, target_id}),

    //DELETE ALL
    requestClearDataFromDb: async (
    collection_name: string,
    ext_id: string,
    user_id: string
    ) => await clearUserDataFromDB({collection_name, ext_id, user_id})
  }



  //? ---------------- INTER EXTENSIONS CONNECTION API ------------------
  const externalExtensionApi: InterConnectionAPI = {
    // POST
    requestWritingDataIntoDb : async <T = unknown>(
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[],
    activeExt_id: string,
    user_id: string,
    collection_name: string,
    payload: T
  ) =>  await createDocInAnotherExtensionCollection({
      targetExt_id, targetExt_allowList,
      activeExt_id, user_id, collection_name, payload
    }),

    // PUT
    requestUpdatingDatInDb: async <T= unknown>(targetExt_id: string,
      targetExt_allowList: ExtAllowList[],
      collection_name: string,
      user_id: string,
      activeExt_id: string,
      targetItem_id: string,
      payload: T,) => await updateDataInAnotherExtData({
        targetExt_allowList, collection_name,
        user_id, activeExt_id, targetExt_id, targetItem_id, payload
      }),
  
    // GET
    requestFetchDataFromDb: async (
      targetExt_id: string,
      targetExt_allowList: ExtAllowList[],
      collection_name: string,
      activeExt_id: string,
      user_id: string,
      fetch_count: number | null,
      targetItem_id: string | null,
      order_by: "desc" | "asc",) =>  await readDataFromAnotherExt({
        targetExt_allowList, collection_name, activeExt_id, user_id,
        fetch_count, targetItem_id, order_by, targetExt_id
      }),

    // DELETE
    requestDeleteDataFromDb: async (targetExt_id: string,
      targetExt_allowList: ExtAllowList[],
      collection_name: string,
      activeExt_id: string,
      user_id: string,
      targetItem_id: string,) => await deleteDataFromAnotherExt({
        targetExt_id, targetExt_allowList, collection_name,
        activeExt_id, user_id, targetItem_id
      })
  }


  //? ---------------- SOCIAL API ------------------
  const socialApi: SocialAPI = {
    requestUsersFriendList: async (user_id: string) => await fetchUsersListBasedOnState({ user_id, target_status: "ACCEPTED" }),
    requestUserProfile: async (user_id:string) => await fetchUsersProfiles({user_ids: [user_id], currentUser_id: user_id}),
  }

  return <AppAPIContext.Provider
    value={{externalApi,
    storageApi,
    socialApi,
    externalExtensionApi}}>
    {children}
  </AppAPIContext.Provider>;
}

export const useAppAPI = () => {
  const ctx = useContext(AppAPIContext);
  if (!ctx) {
    throw new Error('useAppAPI must be used within an AppAPIProvider');
  }
  return ctx;
};