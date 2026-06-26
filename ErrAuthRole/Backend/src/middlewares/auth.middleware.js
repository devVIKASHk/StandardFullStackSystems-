import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.js";


/**
 * @param {object} req 
 * @param {object} res
 * @param {function} next
 */


const authMiddleware = asyncHandler(async (req,res,next)=>{
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token){
        throw new AppError('Not authenticated. Please log in to access this resource.',401)
    }

    const decoded = verifyAccessToken(token);

    const currentUser = await User.findById(decoded.id);

    if (!currentUser){
        throw new AppError(
            'The user belonging to this token no longer exists.',
            401
        )
    }

    req.user = currentUser;

    next();
})


export default authMiddleware