import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

// // Global error handlers (catches everything)
// process.on('unhandledRejection', (err) => {
//     logger.error({
//         error: err.message,
//         stack: err.stack
//     }, 'Unhandled Rejection');
//     process.exit(1);
// });

// process.on('uncaughtException', (err) => {
//     logger.error({
//         error: err.message,
//         stack: err.stack
//     }, 'Uncaught Exception');
//     process.exit(1);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     logger.info('SIGTERM signal received: closing HTTP server');
//     process.exit(0);
// });

// const startServer = async () => {
//     try {

//         await connectDB()
//         const server = app.listen(config.port, (err) => {
//             if (err) {
//                 console.log(err)
//             }
//             logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`)
//         })



//     } catch (error) {
//         logger.error(`Failed to start server: ${error.message}`)
//         process.exit(1)
//     }
// }

// startServer()

// // await connectDB()
// // const server = app.listen(config.port, () => {
// //     logger.info(`Server is running in ${config.nodeEnv} mode on port ${config.port}`)
// // })

let server;

/**
 * =====================================================
 * UNCAUGHT EXCEPTION
 * =====================================================
 * Synchronous errors that escape all try/catch blocks.
 *
 * Examples:
 * - ReferenceError
 * - TypeError
 * - Syntax issues during runtime
 *
 * Application state may be corrupted, so exit.
 * =====================================================
 */
process.on('uncaughtException', (err) => {
    logger.fatal(
        {
            error: err.message,
            stack: err.stack,
        },
        'UNCAUGHT EXCEPTION'
    );
    process.exit(1);
});

/**
 * =====================================================
 * UNHANDLED REJECTION
 * =====================================================
 * Promise rejection that wasn't handled.
 *
 * Examples:
 * - Failed API calls
 * - Database connection errors
 * - Async operation failures
 *
 * Close server gracefully before exit.
 * =====================================================
 */
process.on('unhandledRejection', (err) => {
    logger.fatal(
        {
            error: err.message,
            stack: err.stack,
        },
        'UNHANDLED REJECTION'
    );
    if (server) {
        server.close(() => process.exit(1));
    } else {
        process.exit(1);
    }
});

/**
 * =====================================================
 * GRACEFUL SHUTDOWN
 * =====================================================
 * Triggered by Ctrl+C or process termination signal.
 * Allows cleanup before exit.
 * =====================================================
 */
process.on('SIGTERM', () => {
    logger.info('SIGTERM received: Shutting down gracefully');
    if (server) {
        server.close(() => {
            logger.info('HTTP server closed');
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
});

/**
 * =====================================================
 * START SERVER
 * =====================================================
 */
const startServer = async () => {
    try {
        await connectDB();

        server = app.listen(config.port, () => {
            logger.info(
                `Server running in ${config.nodeEnv} mode on port ${config.port}`
            );
        });

        /**
         * Listen for server-specific errors
         */
        server.on('error', (err) => {
            logger.error(
                {
                    error: err.message,
                    stack: err.stack,
                },
                'HTTP SERVER ERROR'
            );
        });
    } catch (error) {
        logger.fatal(
            {
                error: error.message,
                stack: error.stack,
            },
            'SERVER STARTUP FAILED'
        );
        process.exit(1);
    }
};

startServer();