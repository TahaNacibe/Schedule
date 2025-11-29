import { ACCESS_REJECTED, MISSING_REQUIRED_ARGUMENT } from "@/lib/errors_handlers"
import { deleteDataFromDB, readDataFromDB, updateDataInDB, writeDataToDB } from "./firebase_middleware"


function _getPermissionState(activeExt_id: string, targetExt_allowList: ExtAllowList[]) {
    const state = targetExt_allowList.find((item) => item.id === activeExt_id)
    return state
}


//? --- POST ---
interface CreateDocInAnotherExtensionCollectionInterface <T = unknown> {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    activeExt_id: string,
    user_id: string,
    collection_name: string,
    payload: T
}

//
async function createDocInAnotherExtensionCollection({
    targetExt_id, targetExt_allowList,activeExt_id, user_id, collection_name, payload
}: CreateDocInAnotherExtensionCollectionInterface) {
    console.log("inter -- user_id : " + user_id)
    console.log("inter -- collection_name : " + collection_name)
    // manage args case
    if (!targetExt_id || !activeExt_id || !user_id || !collection_name || !payload)
        return MISSING_REQUIRED_ARGUMENT

    const permissionState = _getPermissionState(activeExt_id, targetExt_allowList)
    // manage access case
    if (!targetExt_allowList || targetExt_allowList.length == 0
        || !permissionState || permissionState.permission === "READ")
        return ACCESS_REJECTED
    
    const response = await writeDataToDB({
        ext_id: targetExt_id,
        collection_name: collection_name,
        user_id: user_id,
        payload: payload
    })
    // return the firebase middleware method response because it's the one with the actual information
    return response
}


//? --- PUT ---
interface UpdateDataInAnotherExtDataInterface<T = unknown> {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    collection_name: string;
    user_id: string;
    activeExt_id: string;
    targetItem_id: string;
    payload: T;
}

async function updateDataInAnotherExtData({
    targetExt_id, targetExt_allowList, collection_name, user_id, activeExt_id, targetItem_id, payload
}:UpdateDataInAnotherExtDataInterface) {
    if (!targetExt_id || !activeExt_id || !user_id
        || !collection_name || !targetItem_id || !payload)
        return MISSING_REQUIRED_ARGUMENT

    const permissionState = _getPermissionState(activeExt_id, targetExt_allowList)
    // manage access case
    if (!targetExt_allowList || targetExt_allowList.length == 0
        || !permissionState || permissionState.permission === "READ")
        return ACCESS_REJECTED
    
    const response = await updateDataInDB({
        collection_name, user_id, ext_id:targetExt_id, target_id:targetItem_id, payload
    })

    return response;
}



//? --- GET ---
interface ReadDataFromAnotherExtInterface {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    collection_name: string;
    activeExt_id: string;
    user_id: string;
    fetch_count: number | null;
    targetItem_id: string | null;
    order_by: "desc" | "asc";
}

async function readDataFromAnotherExt({
    targetExt_allowList, targetExt_id, targetItem_id, collection_name, activeExt_id, user_id, fetch_count, order_by
}: ReadDataFromAnotherExtInterface) {
    // manage args case
    if (!targetExt_id || !activeExt_id || !user_id || !collection_name)
        return MISSING_REQUIRED_ARGUMENT

    const permissionState = _getPermissionState(activeExt_id, targetExt_allowList)
    // manage access case
    if (!targetExt_allowList || targetExt_allowList.length == 0
        || !permissionState || permissionState.permission === "WRITE")
        return ACCESS_REJECTED
    
    const response = readDataFromDB({
        collection_name, ext_id: targetExt_id, user_id,
        fetch_count, target_id: targetItem_id, order_by
    })

    // forward the middleware response
    return response
}


//? --- DELETE ---
interface DeleteDataFromAnotherExtInterface {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    collection_name: string;
    activeExt_id: string;
    user_id: string;
    targetItem_id: string;
}


async function deleteDataFromAnotherExt({
    targetExt_id ,targetExt_allowList ,collection_name ,activeExt_id ,user_id ,targetItem_id
}:DeleteDataFromAnotherExtInterface) {
    // manage args case
    if (!targetExt_id || !activeExt_id || !user_id || !collection_name)
        return MISSING_REQUIRED_ARGUMENT

    const permissionState = _getPermissionState(activeExt_id, targetExt_allowList)
    // manage access case
    if (!targetExt_allowList || targetExt_allowList.length == 0
        || !permissionState || permissionState.permission === "READ")
        return ACCESS_REJECTED
    
    const response = await deleteDataFromDB({
        collection_name, ext_id: targetExt_id, user_id, target_id:targetItem_id
    })

    return response
}


export {
    createDocInAnotherExtensionCollection,
    updateDataInAnotherExtData,
    readDataFromAnotherExt,
    deleteDataFromAnotherExt
}