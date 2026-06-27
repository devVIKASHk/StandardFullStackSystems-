import {z} from 'zod';


export const registerSchema = z.object({
    userName:z  
        .string({required_error:'Username is required'})
        .min(2,'Username must be at least 2 characters')
        .max(50,'Username must be at most 50 characters'),
    
    email: z
        .string({required_error:'Email is required'})
        .email('Please provide a valid email'),
    
    password: z
        .string({required_error:'Password is required'})
        .min(6,'Password must be at least 6 characters')
        .max(70,'Password must be at most 70 characters')

})



export const loginSchema = z.object({
    email:z
        .string({required_error:'Email is required'})
        .email('Provide a valid email'),
    password:z
        .string({required_error:'Password is required'})
        .min(1,'Password is required')

})