
/** 
* @param {number} statusCode 
* @param {string} message 
* @param {*} [data=null]
* @param {object} res 
*/

const sendSuccess = (res,data=null,message,statusCode=200)=>{
    return res.status(statusCode).json({
        success:true,
        message,
        data 
    })
}


export default sendSuccess;