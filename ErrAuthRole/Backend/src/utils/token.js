import jwt from 'jsonwebtoken';

import config from '../config/env.js';



/**
 * @param {object} payload ;
 * @returns {string} 
 */


export const generateAccessToken = (payload)=>{
    return jwt.sign(payload,config.accessTokenScrt,{
        expiresIn:config.accessTokenExpry
    })
}



/**
 * 
 * @param {string} token 
 * @returns {object}
 * @throws {JsonWebTokenError}
 * @throws {TokenExpiredError}
 */

export const verifyAccessToken = (token)=>{
    return jwt.verify(token,config.accessTokenScrt)
};


/**
 * 
 * @param {object} payload 
 * @returns {string}
 */

export const generateRefreshToken = (payload)=>{
    return jwt.sign(payload, config.refreshTokenScrt,{
        expiresIn:config.refreshTokenExpry
    })
}



/**
 * @param {string} token 
 * @returns {object}
 * @throws {JsonWebTokenError}
 * @throws {TokenExpiredError} 
 */


export const verifyRefreshToken = (token)=>{
    return jwt.verify(token,config.refreshTokenScrt)
}