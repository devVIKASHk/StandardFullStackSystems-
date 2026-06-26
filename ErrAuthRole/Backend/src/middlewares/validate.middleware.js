import AppError from '../utils/AppError.js';

/**
 *  @param {import('zod').ZodSchema} schema 
 *  @returns {Function}
 * 
 */





const validate = (schema)=>{
    return (req,res,next)=>{
        try{
            const parsed = schema.parse(req.body);
            req.body = parsed
            next()
        }catch(error){
            if (error.name='ZodError'){
                const message = error.errors.map((err)=>err.message).join(', ');
                throw new AppError(message,400)
            }
            throw error
        }


    }
}

export default validate;