import { ERROR_COMPLETING_TASK, MISSING_REQUIRED_ARGUMENT, TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR } from "@/lib/errors_handlers"
import { db } from "@/lib/firebase"
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"


function generateSearchTokens(text: string): string[] {
    if (!text) return [];

    const lower = text.toLowerCase().trim();
    const tokens: string[] = [];

    for (let i = 1; i <= lower.length; i++) {
        tokens.push(lower.slice(0, i));
    }

    return tokens;
}


function generateExtensionID(name: string) {
    return name.toLowerCase().replaceAll(" ", "_")
}


async function createNewExtensionInstance({ profile, extension }: {
    profile?: Profile | null,
    extension: Partial<ExtensionInstance>
}) {
    if (!profile || !extension)
        return MISSING_REQUIRED_ARGUMENT

    if (!extension.name || !extension.url || !extension.version)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const docRef = doc(collection(db, "extensions"), generateExtensionID(extension.name))
        await setDoc(docRef, {
            ...extension,
            "owner_id": profile.user_id,
            "id": generateExtensionID(extension.name),
            "searchKeys": generateSearchTokens(extension.name)
        })
        

        return TASK_COMPLETED_SUCCESSFULLY({
            ...extension,
            owner_id: profile.user_id,
            id: generateExtensionID(extension.name)
        })
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}

// update
async function updateExtensionInstance({ profile, extension }: {
    profile?: Profile | null,
    extension: Partial<ExtensionInstance>
}) {
    if (!profile || !extension)
        return MISSING_REQUIRED_ARGUMENT

    if (!extension.name || !extension.url || !extension.version || !extension.id)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const docRef = doc(collection(db, "extensions"), extension.id);
        await updateDoc(docRef, {
            "name": extension.name,
            "description": extension.description,
            "url": extension.url,
            "version": extension.version,
            "searchKeys": generateSearchTokens(extension.name)
        })

        return TASK_COMPLETED_SUCCESSFULLY(null)
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}

// read
// fetch user extension
async function fetchUserOwnedExtensions(profile?: Profile | null) {
    if (!profile)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const collRef = collection(db, "extensions")
        const queryRes = await getDocs(query(collRef, where("owner_id", "==", profile.user_id)))
        if (queryRes.empty)
            return TASK_COMPLETED_SUCCESSFULLY([])

        const data = queryRes.docs.map((docItem) => docItem.data()) as ExtensionInstance[]

        return TASK_COMPLETED_SUCCESSFULLY(data)
        
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}

// fetch extension with search
async function fetchSearchExtensionBasedOnQuery(searchQuery:string) {
   try {
       const collRef = collection(db, "extensions")
       const queryRes = await getDocs(query(collRef, where("searchKeys", "array-contains", searchQuery)))
       
       if (queryRes.empty) 
           return TASK_COMPLETED_SUCCESSFULLY([])
       
        const data = queryRes.docs.map((docItem) => docItem.data())

        return TASK_COMPLETED_SUCCESSFULLY(data)
   } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
   }
}

// delete
async function deleteExistingExtension(extension_id:string) {
    if (!extension_id) 
        return MISSING_REQUIRED_ARGUMENT
    
    try {
        const docRef = doc(collection(db, "extensions"), extension_id)
        
        await deleteDoc(docRef)
            
        return TASK_COMPLETED_SUCCESSFULLY(null)
    } catch (error) {
        if (error instanceof Error)
            return ERROR_COMPLETING_TASK(error)
        return UNKNOWN_ERROR
    }
}



export {
    createNewExtensionInstance,
    updateExtensionInstance,
    fetchSearchExtensionBasedOnQuery,
    fetchUserOwnedExtensions,
    deleteExistingExtension,
}