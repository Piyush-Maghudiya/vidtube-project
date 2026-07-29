import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    // Check if the error is an instance of ApiError. If not, wrap it.
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Something went wrong";
        error = new ApiError(statusCode, message, err?.errors || [], err.stack);
    }

    const response = {
        success: false,
        statusCode: error.statusCode,
        message: error.message,
        errors: error.errors,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };

    res.status(error.statusCode).json(response);
};

export default errorHandler;
