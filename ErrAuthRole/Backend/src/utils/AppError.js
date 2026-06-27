class AppError extends Error {
    /**
     * @param {string} message
     * @param {number} statusCode
     */
    constructor(message, statusCode,name='AppError') {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
        this.name = name 

        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError;