import {
    ERROR_COMPLETING_TASK, INCORRECT_ARGUMENTS_PASSED,
    TARGET_WAS_NOT_FOUND, TASK_COMPLETED_SUCCESSFULLY,
    UNKNOWN_ERROR
} from '@/lib/errors_handlers';
import axios, { AxiosRequestConfig, Method } from 'axios';

// Define supported methods for type safety
const SUPPORTED_METHODS: Method[] = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH'];
//? don't be a hero don't fucking try to add these
function unsupportedAction (url: string, config?: AxiosRequestConfig): Promise<any> {
        throw TARGET_WAS_NOT_FOUND;
}

/**
 * Makes an HTTP request using Axios with dynamic method dispatch.
 * @param endpoint - The API endpoint URL.
 * @param request_type - HTTP method (GET|POST|PUT|DELETE).
 * @param data - Request body (for POST/PUT/DELETE) or query params (for GET).
 * @returns Axios response or error code.
 */
export async function makeApiRequest(
    endpoint: string,
    request_type: Uppercase<Method>,
    data?: any
): Promise<CustomResponse> {
    if (!SUPPORTED_METHODS.includes(request_type)) {
        return INCORRECT_ARGUMENTS_PASSED;
    }

    // Map method to Axios function
    const httpMethods: Record<Uppercase<Method>, (url: string, config?: AxiosRequestConfig) => Promise<any>> = {
        GET: axios.get,
        POST: axios.post,
        PUT: axios.put,
        DELETE: axios.delete,
        HEAD:axios.head,
        OPTIONS: axios.options,
        PATCH: axios.patch,
        PURGE: unsupportedAction,
        LINK: unsupportedAction,
        UNLINK: unsupportedAction
    };

    //* get the requested method
    const httpMethod = httpMethods[request_type];
    const config: AxiosRequestConfig = {
    ...(request_type === 'GET' ? { params: data } : { data }),
    };

    try {
        const res = await httpMethod(endpoint, config);
        return TASK_COMPLETED_SUCCESSFULLY(res.data)
    } catch (error) {
        if (error instanceof Error) {
            return ERROR_COMPLETING_TASK(error)
        }
        return UNKNOWN_ERROR
    }
}