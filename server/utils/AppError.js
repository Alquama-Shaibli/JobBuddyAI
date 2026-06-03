/**
 * Operational errors - predictable, trusted errors we throw ourselves.
 * Non-operational errors (bugs, unexpected) bubble through as generic 500s.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
