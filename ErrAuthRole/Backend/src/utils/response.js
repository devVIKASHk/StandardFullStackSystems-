
/** 
* @param {number} statusCode 
* @param {string} message 
* @param {*} [data=null]
* @param {object} res 
*/

const sendSuccess = (res,statusCode,message,data=null)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data 
    })
}


export default sendSuccess;