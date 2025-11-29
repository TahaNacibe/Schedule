//* in case any of the required args is missing 
const MISSING_REQUIRED_ARGUMENT = {
    success: false,
    message: "Request missing required arguments - [400]",
    data: null,
};


//* passed args are not as expected by the app
const INCORRECT_ARGUMENTS_PASSED = {
    success: false,
    message: "Arguments passed are of unmatched type - [420]",
    data: null,
};


//* something unexpected happened (AKA wasn't handled)
const UNKNOWN_ERROR = {
    success: false,
    message: "An Unknown error accord while processing request - [500]",
    data: null,
};


//* the target from the request either doesn't exist or returned a 404 error
const TARGET_WAS_NOT_FOUND = {
    success: false,
    message: "Couldn't find the requested data - [404]",
    data: null,
};


//* the target from the request either doesn't exist or returned a 404 error
const ACCESS_REJECTED = {
    success: false,
    message: "Not enough permissions - [403]",
    data: null,
};


//* an recognized and handled error accrued just forward to extension
const ERROR_COMPLETING_TASK = (error: Error) => ({
    success: false,
    message: "Failed to complete the task [ERROR]: " + error.name,
    data: error.message,
});


//* Globalize the success response formate so extensions have a clear expectations
const TASK_COMPLETED_SUCCESSFULLY = <T = unknown>(data: T) => ({
    success: true,
    message: "Task Completed",
    data: data,
});


export {
    MISSING_REQUIRED_ARGUMENT,
    UNKNOWN_ERROR,
    ACCESS_REJECTED,
    TARGET_WAS_NOT_FOUND,
    INCORRECT_ARGUMENTS_PASSED,
    ERROR_COMPLETING_TASK,
    TASK_COMPLETED_SUCCESSFULLY
}