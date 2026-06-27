import env from '../validators/env.validator.js';

// Environment Variables constants
const CONFIG = Object.freeze({
    port: env.PORT,
    mongoUri: env.MONGO_URI,
    accessTokenScrt: env.ACCESS_TOKEN_SECRET,
    accessTokenExpry: env.ACCESS_TOKEN_EXPIRY,
    refreshTokenScrt: env.REFRESH_TOKEN_SECRET,
    refreshTokenExpry: env.REFRESH_TOKEN_EXPIRY,
    nodeEnv: env.NODE_ENV,
    corsOrigin: env.CORS_ORIGIN
});

export default CONFIG;
