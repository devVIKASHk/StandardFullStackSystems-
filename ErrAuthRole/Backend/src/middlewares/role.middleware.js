
import AppError from "../utils/AppError";

/**
 * @param {...string} allowedRoles 
 * @returns {Function}
 */




const authorizedRoles = (...allowedRoles)=>{
    return (req,res,next)=>{
        if (!allowedRoles.includes(req.user.role)){
            throw new AppError('Access denied. Insufficient permissions.',403)
        }
        next();
    }

}


export default authorizedRoles;