import {z} from 'zod';
import dotenv from 'dotenv';
import chalk from 'chalk';
dotenv.config()

const envSchema = z.object({
    PORT: z.coerce.number().default(5000),
    MONGO_URI: z.string().url().default('mongodb://localhost:27017/Auth_System'),
    ACCESS_TOKEN_SECRET: z.string().min(10,'ACCESS_TOKEN_SECRET must be at least 10 characters'),
    ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    REFRESH_TOKEN_SECRET: z.string().min(10,'ACCESS_TOKEN_SECRET must be at least 10 characters'),
    REFRESH_TOKEN_EXPIRY: z.string().default('7d'),
    NODE_ENV: z.enum(['development','production','test']).default('development'),
    CORS_ORIGIN:z.string().url().default('http://localhost:5174')
})


const parsedEnv = envSchema.safeParse(process.env)


if (!parsedEnv.success){
    console.error(
        chalk.redBright('❌ Something wrong with environment variable validation \n'),
        JSON.stringify(parsedEnv.error.format(),null,4)
    );
    process.exit(1)
}

const validatedEnvData = parsedEnv.data

export default validatedEnvData ;