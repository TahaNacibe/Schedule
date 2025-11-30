import {
    ERROR_COMPLETING_TASK, MISSING_REQUIRED_ARGUMENT,
    TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR
} from "@/lib/errors_handlers"

/**
 * Uploads a file to Cloudinary using the Electron preload API.
 *
 * @param {CloudinaryMiddlewareInterface} params - Upload parameters.
 * @param {string} params.file_path - Local path of the file to upload.
 * @param {string} params.ext_id - Public ID to assign on Cloudinary.
 *
 * @returns {Promise<CustomResponse>} The upload result or an error response.
 */
interface CloudinaryMiddlewareInterface{
    file_path: string,
    ext_id: string
}
//
export default async function cloudinaryMiddleware({ file_path, ext_id }: CloudinaryMiddlewareInterface) {
    if (!file_path || !ext_id)
        return MISSING_REQUIRED_ARGUMENT

    try {
        const imagePath = await window.electronAPI?.uploadFile(
        file_path,
        ext_id
        )
        return TASK_COMPLETED_SUCCESSFULLY(imagePath)
    } catch (error) {
        if (error instanceof Error) {
            return ERROR_COMPLETING_TASK(error)
        }
        return UNKNOWN_ERROR
    }
}