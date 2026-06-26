import config from '../config/env.js'

// Allowed Roles 

export const ROLES = Object.freeze({
    USER:'user',
    ADMIN:'admin',
    SUPER_ADMIN:'super_admin'
})


export const COOKIE_OPTIONS = Object.freeze({
    httpOnly:true,
    secure:config.nodeEnv==='production',
    sameSite:'strict',

})



export const HTTP_STATUS = Object.freeze({
    //---Success Codes--- 

    OK:200,
    CREATED:201,
    NO_CONTENT:204,

    //---Client Error Codes ---

    BAD_REQUEST:400,
    UNAUTHORIZED:401,
    FORBIDDEN:403,
    NOT_FOUND:404,
    CONFLICT:409,
    UNPROCESSABLE_ENTITY:422,
    TOO_MANY_REQUESTS:429,

    //--- Server Error Codes --- 

    INTERNAL_SERVER_ERROR:500,
    SERVICE_UNAVAILABLE:503 

})
