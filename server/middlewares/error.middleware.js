import logger from '../utils/logger.js';

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        message = `${field} already exists`;
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token. Please log in again.';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }

    // Log server errors
    if (statusCode >= 500) {
        logger.error(`${req.method} ${req.originalUrl} — ${message}`, { stack: err.stack });
    } else {
        logger.warn(`${req.method} ${req.originalUrl} — ${statusCode} ${message}`);
    }

    // Never leak stack traces in production
    const response = {
        success: false,
        status: statusCode,
        message,
    };

    if (process.env.NODE_ENV === 'development' && statusCode >= 500) {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

export default errorHandler;