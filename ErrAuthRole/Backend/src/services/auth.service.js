
import bcrypt from 'bcryptjs';
import sessionRepository from "../repositories/session.repository.js";
import AppError from "../utils/AppError.js"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/token.js";
import userRepository from '../repositories/user.repository.js';
import logger from '../utils/logger.js';

const getSessionExpiry = ()=>{
    const expiry = new Date();
    expiry.setDate(expiry.getDate()+2)
    return expiry
}

const authService = {
    register :async (userName,email,password)=>{
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) throw new AppError('Email already registered',409);
        
        
        const user = await userRepository.createUser({userName,email,password});

        logger.info(`New user registred: ${email}`);

        const accessToken = generateAccessToken({
            id:user._id,
            role:user.role,
        });

        const session = await sessionRepository.createSession({
            userId:user._id,
            currentRefreshTokenHash:'temp',
            deviceInfo:'Unknown Device',
            ipAddress:'Unknown IP',
            expiresAt: getSessionExpiry()

        });

        const refreshToken = generateRefreshToken({id:user._id,sessionId:session._id});
        const salt = await bcrypt.genSalt(10);
        const refreshTokenHash = await bcrypt.hash(refreshToken,salt);

        await sessionRepository.updateTokenHash(session._id,refreshTokenHash)


        return {
            user:{
                id:user._id,
                userName:user.userName,
                email:user.email,
                role:user.role,

            },
            accessToken,
            refreshToken
        }

    },

    login: async (email,password,userAgent,ipAddress)=>{
        const user = await userRepository.findByEmailWithPassword(email);

        if (!user) throw new AppError('Invalid Credentials',401);

        const isPasswordCorrect =  await user.comparePassword(password);

        if (!isPasswordCorrect) throw new AppError('Invalid Credentials',401);



        const accessToken = generateAccessToken({id:user._id,role:user.role});

        const session = await sessionRepository.createSession({
            userId:user._id,
            currentRefreshTokenHash:'temp',
            deviceInfo: 'Parsed Device Info',
            userAgent:userAgent || 'Unknown UserAgent',
            ipAddress:ipAddress || 'Unknown IP',
            expiresAt:getSessionExpiry()
        })


        const refreshToken = generateRefreshToken({id:user._id,sessionId:session._id});

        const salt = await bcrypt.genSalt(10);
        const refreshTokenHash = await bcrypt.hash(refreshToken,salt);

        await sessionRepository.updateTokenHash(session._id,refreshTokenHash);

        logger.info(`User logged in: ${email}`);

        return {
            user:{
                id:user._id,
                userName:user.userName,
                email:user.email,
                role:user.role ,

            },
            accessToken,
            refreshToken
        }
    }
    ,
    refreshAccessToken: async (oldRefreshToken)=>{
        if (!oldRefreshToken){
            throw new AppError('Refresh Token is required',401);
        }

        let payload;

        try{

            payload = verifyRefreshToken(oldRefreshToken);

        }catch(error){
            throw new AppError('Invalid or expired refresh token',401);
        }

        const sessionId = payload.sessionId;

        if (!sessionId){
            throw new AppError('Invalid token format',401);
        }

        const session = await sessionRepository.findById(sessionId);

        if (!session || !session.isValid()){
            logger.warn(`Attempted refresh with invalid/revoked session: ${sessionId}`);
            throw new AppError('Session Expired or revoked. Please log in again.',401);
        }

        const user = await userRepository.findById(payload.id);

        if (!user){
            throw new AppError('User not found. Token is invalid.',401);
        }

        const isTokenValid  = await bcrypt.compare(oldRefreshToken,session.currentRefreshTokenHash);

        if (!isTokenValid){
            await sessionRepository.revokeSession(session._id);

            logger.warn(`Refresh token reuse detected for session ${session._id}. Session revoked.`);

            throw new AppError(
                'Refresh token reuse detected. Please log in again.',403
            );
        }

        const newAccessToken = generateAccessToken({
            id:user._id,
            role:user.role
        });

        const newRefreshToken = generateRefreshToken({
            id:user._id,
            sessionId:session._id
        })

        const salt = await bcrypt.genSalt(10);
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken,salt);

        await sessionRepository.updateTokenHash(session._id,newRefreshTokenHash);

        logger.info(`Access token refreshed for session: ${session._id}`);


        return {
            accessToken:newAccessToken,
            refreshToken:newRefreshToken
        }





    },

    

    logout: async (refreshToken)=>{
        if (!refreshToken) return;

        try{
            const payload = verifyRefreshToken(refreshToken);

            if (payload.sessionId){
                await sessionRepository.revokeSession(payload.sessionId);
                logger.info(`Session revoked on logout: ${payload.sessionId}`)
            }
        }catch(error){
            logger.warn('Logout called with invalid token')
        }
    },

    logoutAllDevices: async (userId)=>{
        await sessionRepository.revokeAllUserSession(userId);

        logger.info(`All sessions revoked for user: ${userId}`)
    },

    getCurrentUser: async (userId)=>{
        const user = await userRepository.findById(userId);

        if (!user){
            throw new AppError('User not found',404);
        }

        return {
            id:user._id,
            userName:user.userName,
            email:user.email,
            role:user.role
        };

    }
}


export default authService;
