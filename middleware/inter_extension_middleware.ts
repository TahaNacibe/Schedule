import { ACCESS_REJECTED, MISSING_REQUIRED_ARGUMENT } from "@/lib/errors_handlers"
import { deleteDataFromDB, readDataFromDB, updateDataInDB, writeDataToDB } from "./firebase_middleware"



/**
 * Finds the permission entry for the active extension inside the target allow-list.
 * @param {string} activeExt_id - The ID of the extension requesting access.
 * @param {ExtAllowList[]} targetExt_allowList - The allow-list containing permission records.
 * @returns {ExtAllowList | undefined} The matching permission state, if found.
 */
function _getPermissionState(activeExt_id: string, targetExt_allowList: ExtAllowList[]) {
    const state = targetExt_allowList.find((item) => item.id === activeExt_id)
    return state
}



/**
 * Creates a document inside another extension's collection.
 * Validates arguments, checks write permission, then forwards to writeDataToDB().
 *
 * @template T
 * @param {Object} params - Operation parameters.
 * @param {string} params.targetExt_id - Target extension that owns the collection.
 * @param {ExtAllowList[]} params.targetExt_allowList - Permission entries of the target extension.
 * @param {string} params.activeExt_id - Extension performing the operation.
 * @param {string} params.user_id - User associated with the new document.
 * @param {string} params.collection_name - Name of the collection to write to.
 * @param {T} params.payload - Document data to create.
 * @returns {Promise<any>} Firebase handler response or an error object.
 */
interface CreateDocInAnotherExtensionCollectionInterface <T = unknown> {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    activeExt_id: string,
    user_id: string,
    collection_name: string,
    payload: T
}
//? --- POST ---
async function createDocInAnotherExtensionCollection({
    targetExt_id, targetExt_allowList,activeExt_id, user_id, collection_name, payload
}: CreateDocInAnotherExtensionCollectionInterface) {
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


/**
 * Updates an existing document inside another extension's collection.
 * Requires WRITE permission. Forwards the update to updateDataInDB().
 *
 * @template T
 * @param {Object} params - Operation parameters.
 * @param {string} params.targetExt_id - Target extension that owns the document.
 * @param {ExtAllowList[]} params.targetExt_allowList - Permission entries of the target extension.
 * @param {string} params.collection_name - Collection where the document is stored.
 * @param {string} params.user_id - User associated with the document.
 * @param {string} params.activeExt_id - Extension performing the operation.
 * @param {string} params.targetItem_id - ID of the document to update.
 * @param {T} params.payload - Fields to update.
 * @returns {Promise<any>} Firebase handler response or an error object.
 */
interface UpdateDataInAnotherExtDataInterface<T = unknown> {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    collection_name: string;
    user_id: string;
    activeExt_id: string;
    targetItem_id: string;
    payload: T;
}
//? --- PUT ---
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



/**
 * Reads documents from another extension's collection.
 * Requires READ permission. Forwards the read to readDataFromDB().
 *
 * @param {Object} params - Operation parameters.
 * @param {string} params.targetExt_id - Extension that owns the data.
 * @param {ExtAllowList[]} params.targetExt_allowList - Permission entries of the target extension.
 * @param {string} params.collection_name - The collection to read from.
 * @param {string} params.activeExt_id - Extension requesting the read.
 * @param {string} params.user_id - User associated with the data.
 * @param {number|null} params.fetch_count - Optional limit for number of documents.
 * @param {string|null} params.targetItem_id - Optional document ID to fetch a single item.
 * @param {"asc"|"desc"} params.order_by - Sort direction for timestamp-based reads.
 * @returns {Promise<any>} Firebase handler response or an error object.
 */
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
//? --- GET ---
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




/**
 * Deletes a document from another extension's collection.
 * Requires WRITE permission. Forwards to deleteDataFromDB().
 *
 * @param {Object} params - Operation parameters.
 * @param {string} params.targetExt_id - Target extension that owns the collection.
 * @param {ExtAllowList[]} params.targetExt_allowList - Permission entries of the target extension.
 * @param {string} params.collection_name - Collection where the document is stored.
 * @param {string} params.activeExt_id - Extension performing the deletion.
 * @param {string} params.user_id - User associated with the document.
 * @param {string} params.targetItem_id - ID of the document to delete.
 * @returns {Promise<any>} Firebase handler response or an error object.
 */
interface DeleteDataFromAnotherExtInterface {
    targetExt_id: string,
    targetExt_allowList: ExtAllowList[]
    collection_name: string;
    activeExt_id: string;
    user_id: string;
    targetItem_id: string;
}
//? --- DELETE ---
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