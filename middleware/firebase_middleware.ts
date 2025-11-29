import {
  MISSING_REQUIRED_ARGUMENT, TASK_COMPLETED_SUCCESSFULLY,
  ERROR_COMPLETING_TASK, UNKNOWN_ERROR, TARGET_WAS_NOT_FOUND
} from "@/lib/errors_handlers";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

/**
 * @param extCollectionPathRef => get the path to the collection of the user at the extension storage
 * @returns {CollectionReference<DocumentData, DocumentData>}
 * **/

const extCollectionPathRef = ({
  collection_name,
  ext_id,
  user_id,
}: {
  collection_name: string;
  ext_id: string;
  user_id: string;
  }) => {
  console.log("ext path -- user_id : " + user_id)
    console.log("ext path -- collection_name : " + collection_name)
  const extCollRef = collection(db, ext_id);
  const spicCollRef = doc(extCollRef, collection_name);
  const userDocRef = collection(spicCollRef, user_id);
  console.log(userDocRef)
  return userDocRef;
};

/** 
* the function will handle sub collection delete operation for a single subclass at a time
- @param {CollectionReference} parentRef => the collection needed to be cleared
- @param {string} subcollectionName => teh collection in question
- @param {number} batchSize => the number of processes in single patch 
-----------
- response follow the specified rules
- @param {boolean} success => indicate if action was completed or failed 
- @param {string} message => contain a small message about the situation
- @param {unknown} data => the response data in case of no data it return null
**/


//* Interface
interface deleteSubcollectionInterface {
  parentRef: DocumentReference;
  subcollectionName: string;
  batchSize?: number;
}


//* Delete a sub collection from a parent for extensions
const deleteSubcollection = async ({
  parentRef,
  subcollectionName,
  batchSize = 500,
}: deleteSubcollectionInterface): Promise<CustomResponse> => {
  try {
    if (!parentRef || !subcollectionName) {
      return MISSING_REQUIRED_ARGUMENT;
    }
    const subCollRef = collection(parentRef, subcollectionName);
    const snapshot = await getDocs(subCollRef);

    if (snapshot.empty) {
      return TASK_COMPLETED_SUCCESSFULLY(null);
    }

    // Process in batches
    const batches: ReturnType<typeof writeBatch>[] = [];
    let currentBatch = writeBatch(db);
    let operationCount = 0;

    for (const docSnap of snapshot.docs) {
      currentBatch.delete(docSnap.ref);
      operationCount++;
      if (operationCount >= batchSize) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }
    if (operationCount > 0) {
      batches.push(currentBatch);
    }

    for (const batch of batches) {
      await batch.commit();
    }

    return TASK_COMPLETED_SUCCESSFULLY(null);
  } catch (error) {
    if (error instanceof Error) {
      return ERROR_COMPLETING_TASK(error);
    }
    return UNKNOWN_ERROR;
  }
};



/** 
* Write to db all post request to db from app and extensions pass through this middleware
- @param {string} ext_id => is the id specified to the extension making the request parent app will use 'MAIN-APP' as id
- @param {string} collection_name => is the collection the extension own and contain the current file
- @param {string} user_id => current auth user must be supplied as data for each user is separated
- @param {unknown} payload => the data the extension try to complete action with can be of any type (unknown)
-----------
- response follow the specified rules
- @param {boolean} success => indicate if action was completed or failed 
- @param {string} message => contain a small message about the situation
- @param {unknown} data => the response data in case of no data it return null
**/


//* Interface
interface writeDataToDBInterface<T = unknown> {
  ext_id: string;
  collection_name: string;
  user_id: string;
  payload: T;
}

//? --- POST ----
async function writeDataToDB({
  ext_id,
  collection_name,
  user_id,
  payload,
}: writeDataToDBInterface): Promise<CustomResponse> {
  console.log("firebase -- user_id : " + user_id)
  console.log("firebase -- collection_name : " + collection_name)
  //? Null check
  if (!collection_name || !payload || !user_id || !ext_id) {
    return MISSING_REQUIRED_ARGUMENT;
  }

  try {
    const createdTime = Timestamp.now;
    const collectionRef = extCollectionPathRef({
      collection_name: collection_name,
      user_id: user_id,
      ext_id: ext_id,
    });
    //? create document
    const res = await addDoc(collectionRef, {
      ...payload,
      "createdAt": Timestamp.now(),
      "updatedAt  ": Timestamp.now()
    });

    //? update with id for later purposes (fetch)
    const updatedData = { ...payload, id: res.id, createAt: createdTime };

    //? send data
    return TASK_COMPLETED_SUCCESSFULLY(updatedData);
  } catch (error) {
    if (error instanceof Error) {
      return ERROR_COMPLETING_TASK(error);
    }
    return UNKNOWN_ERROR;
  }
}

/** 
* read data for a specific user from a specific collection based on id
- @param {string} ext_id => is the id specified to the extension making the request parent app will use 'MAIN-APP' as id
- @param {string} collection_name => is the collection the extension own and contain the current file
- @param {string} user_id => current auth user must be supplied as data for each user is separated
- @param {number} fetch_count => the number of item fetched 
- @param {string} target_id => target doc id can be null in case fetching but number
- @param {"desc" | "asc"} order_by => data order by time created 
-----------
- response follow the specified rules
- @param {boolean} success => indicate if action was completed or failed 
- @param {string} message => contain a small message about the situation
- @param {unknown} data => the response data in case of no data it return null
**/

//* interface
interface readDataFromDBInterface {
  collection_name: string;
  ext_id: string;
  user_id: string;
  fetch_count: number | null;
  target_id: string | null;
  order_by: "desc" | "asc";
}

//? --- GET ---
async function readDataFromDB({
  collection_name,
  ext_id,
  user_id,
  fetch_count,
  target_id,
  order_by = "desc",
}: readDataFromDBInterface): Promise<CustomResponse> {
  if (!collection_name || !ext_id || !user_id) {
    return MISSING_REQUIRED_ARGUMENT;
  }
  let data = [];
  let snapshot;

  try {
    const queryArg = target_id
      ? limit(1)
      : (limit(fetch_count ?? 1), orderBy("createdAt", order_by));
    const collectionRef = extCollectionPathRef({
      collection_name: collection_name,
      user_id: user_id,
      ext_id: ext_id,
    });
    // in case user need only one doc they just need to supply that id

    if (!collectionRef)
      return {
        success: false,
        message: "failed to create collection path to user",
        data: null,
      };

    if (target_id) {
      const docRef = doc(collectionRef, target_id);
      snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return TARGET_WAS_NOT_FOUND;
      }

      // let it be don't try to act smart
      data = [snapshot.data()];
    } else {
      snapshot = await getDocs(query(collectionRef, queryArg));
      if (snapshot.empty)
        return {
          success: true,
          message: "successful fetch but target empty",
          data: [],
        };

      data = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          "id": doc.id,
        };
      });
    }

    return TASK_COMPLETED_SUCCESSFULLY(data);
  } catch (error) {
    if (error instanceof Error) {
      return ERROR_COMPLETING_TASK(error);
    }
    return UNKNOWN_ERROR;
  }
}

/** 
* update existing data in db for specific doc at specific user based on id doesn't include recursive 
- @param {string} collection_name => is the collection the extension own and contain the current file
- @param {string} ext_id => is the id specified to the extension making the request parent app will use 'MAIN-APP' as id
- @param {string} user_id => current auth user must be supplied as data for each user is separated
- @param {string} target_id => target doc id can be null in case fetching but number
- @param {unknown} update_data => the response data in case of no data it return null
-----------
- response follow the specified rules
- @param {boolean} success => indicate if action was completed or failed 
- @param {string} message => contain a small message about the situation
- @param {unknown} data => the response data in case of no data it return null
**/

//* Interface
interface updateDataToDBInterface<T = unknown> {
  collection_name: string;
  user_id: string;
  ext_id: string;
  target_id: string;
  payload: T;
}

//? --- PUT ----
async function updateDataInDB({
  collection_name,
  user_id,
  ext_id,
  target_id,
  payload,
}: updateDataToDBInterface): Promise<CustomResponse> {
  if (!collection_name || !user_id || !ext_id || !target_id || !payload) {
    return MISSING_REQUIRED_ARGUMENT;
  }

  try {
    const collectionRef = extCollectionPathRef({
      collection_name: collection_name,
      user_id: user_id,
      ext_id: ext_id,
    });

    const targetRef = doc(collectionRef, target_id);
    const snapshot = await getDoc(targetRef);

    if (!snapshot.exists()) {
      return TARGET_WAS_NOT_FOUND;
    }

    await updateDoc(targetRef, {
      ...payload,
      "updatedAt": Timestamp.now(),
    });

    return TASK_COMPLETED_SUCCESSFULLY(null);
  } catch (error) {
    if (error instanceof Error) {
      return ERROR_COMPLETING_TASK(error);
    }
    return UNKNOWN_ERROR;
  }
}

/** 
* delete a specific doc from a specific user based on id
- @param {string} collection_name => is the collection the extension own and contain the current file
- @param {string} ext_id => is the id specified to the extension making the request parent app will use 'MAIN-APP' as id
- @param {string} user_id => current auth user must be supplied as data for each user is separated
- @param {string} target_id => target doc id can be null in case fetching but number
-----------
- response follow the specified rules
- @param {boolean} success => indicate if action was completed or failed 
- @param {string} message => contain a small message about the situation
- @param {unknown} data => the response data in case of no data it return null
**/

//* Interface
interface deleteDataFromDBInterface {
  collection_name: string;
  ext_id: string;
  user_id: string;
  target_id: string;
}

//? --- DELETE ----
async function deleteDataFromDB({
  collection_name,
  ext_id,
  user_id,
  target_id,
}: deleteDataFromDBInterface): Promise<CustomResponse> {
  if (!collection_name || !ext_id || !user_id || !target_id) {
    return MISSING_REQUIRED_ARGUMENT;
  }

  try {
    const collectionRef = extCollectionPathRef({
      collection_name: collection_name,
      user_id: user_id,
      ext_id: ext_id,
    });

    const targetRef = doc(collectionRef, target_id);
    const snapshot = await getDoc(targetRef);

    if (!snapshot.exists()) {
      return TARGET_WAS_NOT_FOUND;
    }

    await deleteDoc(targetRef);

    return TASK_COMPLETED_SUCCESSFULLY(null);
  } catch (error) {
    if (error instanceof Error) {
      return ERROR_COMPLETING_TASK(error);
    }
    return UNKNOWN_ERROR;
  }
}

/** 
* Clear user data from db by deleting every single doc in the collection of the user
- @param {string} collection_name => is the collection the extension own and contain the current file
- @param {string} ext_id => is the id specified to the extension making the request parent app will use 'MAIN-APP' as id
- @param {string} user_id => current auth user must be supplied as data for each user is separated
- @param {string} target_id => target doc id can be null in case fetching but number
-----------
- response follow the specified rules
- @param {boolean} success => indicate if action was completed or failed 
- @param {string} message => contain a small message about the situation
- @param {unknown} data => the response data in case of no data it return null
**/

//* Interface
interface clearUserDataFromDBInterface {
  collection_name: string;
  ext_id: string;
  user_id: string;
}

//? ---- DELETE ----
async function clearUserDataFromDB({
  collection_name,
  ext_id,
  user_id,
}: clearUserDataFromDBInterface): Promise<CustomResponse> {
  if (!collection_name || !ext_id || !user_id) {
    return MISSING_REQUIRED_ARGUMENT;
  }

  try {
    const userCollRef = doc(collection(db, ext_id), user_id);
    const res = await deleteSubcollection({
      parentRef: userCollRef,
      subcollectionName: collection_name,
    });
    // redirect error in case of fall back
    if (!res.success) {
      return res;
    }

    return TASK_COMPLETED_SUCCESSFULLY(null);
  } catch (error) {
    if (error instanceof Error) {
      return ERROR_COMPLETING_TASK(error);
    }
    return UNKNOWN_ERROR;
  }
}

export {
  writeDataToDB,
  readDataFromDB,
  updateDataInDB,
  deleteDataFromDB,
  clearUserDataFromDB,
};
