import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    let error = err;

    const code = error.statuscode || error.statusCode || 500;

    // Check if the error is an instance of ApiError. If not, wrap it.
    if (!(error instanceof ApiError)) {
        const message = error.message || "Something went wrong";
        error = new ApiError(code, message, err?.errors || [], err.stack);
    }

    const response = {
        success: false,
        statusCode: code,
        message: error.message,
        errors: error.errors,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };

    res.status(code).json(response);
};

export default errorHandler;
