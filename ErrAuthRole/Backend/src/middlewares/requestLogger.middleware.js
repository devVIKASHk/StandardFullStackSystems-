import asyncHandler from "../utils/asyncHandler.js";
/**
 * @param {object} req 
 * @param {object} res 
 * @param {function}
 */





const requestLogger = asyncHandler(async (req,res,next)=>{
    const startTime = Date.now();

    res.once('finish',()=>{
        const responseTime = Date.now() - startTime

        const logData ={
            method:req.method,
            url:req.originalUrl,
            statusCode:res.statusCode,
            responseTime:`${responseTime}ms`
        };


        if (res.statusCode>=500){
            logger.error(logData,'Server error response');
        }else if (res.statusCode>=400){
            logger.warn(logData,'Client error response')
        }else{
            logger.info(logData,'Request Completed')
        }

    })

    next()
})


export default requestLogger;