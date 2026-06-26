import { COOKIE_OPTIONS } from "../constants.js";
import authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendSuccess from "../utils/response.js";


export const register = asyncHandler(async (req,res)=>{
    const {userName,email,password}=  req.body;

    const {user,accessToken,refreshToken} = await authService.register(
        userName,
        email,
        password
    );

    res.cookie('refreshToken',refreshToken,COOKIE_OPTIONS);

    sendSuccess(res,{user,accessToken},'User registered successfully',201)
});



export const login = asyncHandler(async (req,res)=>{
    const {email,password} = req.body;
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip || req.connection.remoteAddress;

    const {user,accessToken,refreshToken} = await authService.login(
        email,
        password,
        userAgent,
        ipAddress
    );

    res.cookie('refreshToken',refreshToken,COOKIE_OPTIONS);
    
    sendSuccess(res,{user,accessToken},'Login Successfully')
});



export const refreshToken = asyncHandler(async (req,res)=>{
    const oldRefreshToken = req.cookies.refreshToken;

    const {accessToken,refreshToken:newRefreshToken} = authService.refreshAccessToken(oldRefreshToken);

    res.cookie('refreshToken',newRefreshToken,COOKIE_OPTIONS);

    sendSuccess(res,{accessToken},'Token refreshed successfully');
});


export const logout = asyncHandler(async (req,res)=>{
    const oldRefreshToken = req.cookies.refreshToken;

    await authService.logout(oldRefreshToken);

    res.clearCookie('refreshToken',COOKIE_OPTIONS);

    sendSuccess(res,null,'Logged out successfully');
});

export const logoutAllDevices = asyncHandler(async (req,res)=>{
    const user = await authService.getCurrentUser(req.user._id);

    res.clearCookie('refreshToken',COOKIE_OPTIONS);

    sendSuccess(res,null,'Logged out of all devices successfully')
});


export const getMe = asyncHandler(async (req,res)=>{
    const user = await authService.getCurrentUser(req.user._id);

    sendSuccess(res,{user},'Current user fetched successfully')
})





