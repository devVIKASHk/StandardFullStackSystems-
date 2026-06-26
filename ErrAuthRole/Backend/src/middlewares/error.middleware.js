
import config from '../config/env.js'


/**
 * 
 * @param {Error} err 
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let isOperational = err.isOperational || false;


    logger.error({
        message: err.message,
        statusCode,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl
    })

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid resource ID';
        isOperational = true
    }


    if (err.code = 11000) {
        statusCode = 409;
        message = 'Email already exists';
        isOperational = true
    }


    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(
            (val) => val.message

        ).join(', ');
        isOperational = true
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token. Please log in again.';
        isOperational = true

    }
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired. Please log in again.';
        isOperational = true;
    }


    if (config.nodeEnv === 'development') {

        return res.status(statusCode).json({
            success: false,
            message,
            errorName: err.name,
            statusCode,
            stack: err.stack
        })
    }


    return res.status(statusCode).json({
        success: false,
        message: isOperational ? message : 'Something went wrong'
    })
}


export default errorHandler;