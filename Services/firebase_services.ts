import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

//  ------------------------ WRITE --------------------------------------
async function writeFromDB<T = unknown>(
  collection_name: string,
  
  payload: T
): Promise<CustomResponse> {
  // null fixing
  if (!collection_name || !payload) {
    return {
      success: false,
      message: "messing required argument",
      data: null,
    };
  }

  // creating the collection
  const collectionRef = collection(db, collection_name);

  try {
    const createdTime = Timestamp.now;
    // create document
    const res = await addDoc(collectionRef, {
      ...payload,
      createAt: createdTime,
    });

    // update with id for later purposes (fetch)
    const updatedData = { ...payload, id: res.id, createAt: createdTime };

    // send data
    return {
      success: true,
      message: "Created Successfully",
      data: updatedData,
    };
  } catch (error) {
    console.log("error:" + error);
    if (error instanceof Error) {
      return {
        success: false,
        message: "Error Failed",
        data: error.message,
      };
    } else {
      return {
        success: false,
        message: "unknown Error",
        data: null,
      };
    }
  }
}

// ------------------------ READ --------------------------------------
async function readFromDB({}: {
  collection_name: string;
  id: string | null;
  owner_id: string;
}) {}

// ------------------------ update --------------------------------------

// ------------------------ delete --------------------------------------
