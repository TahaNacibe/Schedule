import {
    ERROR_COMPLETING_TASK, MISSING_REQUIRED_ARGUMENT,
    TASK_COMPLETED_SUCCESSFULLY, UNKNOWN_ERROR
} from "@/lib/errors_handlers"


interface CloudinaryMiddlewareInterface{
    file_path: string,
    ext_id: string
}

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