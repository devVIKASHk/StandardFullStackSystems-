/** 
 * @param {Function} fn 
 * @returns {Function}
 */


const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch(next)
    }
}

export default asyncHandler;