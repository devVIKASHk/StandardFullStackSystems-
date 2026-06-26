import userService from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendSuccess from "../utils/response.js";




export const getAllUsers = asyncHandler(async (req,res)=>{
    const users = await userService.getAllUsers();

    sendSuccess(res,{users},'All users fetched successfully');
})



export const deleteUser = asyncHandler(async (req,res)=>{
    const deletedUser = await userService.deleteUser(
        req.params.id,
        req.user._id
    )

    sendSuccess(res,{user:deletedUser},'User deleted Successfully');
})


export const updateProfile  = asyncHandler(async (req,res)=>{
    const updatedUser = await userService.updateProfile(
        req.user._id,
        req.body
    )

    sendSuccess(res,{user:updatedUser},'Profile updated successfully')
})