import userRepository from "../repositories/user.repository.js"
import AppError from "../utils/AppError.js";
import logger from "../utils/logger.js";


const userService = {

    /**
     * 
     * @returns {Promise<Array>}
     */
    getAllUsers: async ()=>{
        const users = await userRepository.findAll();
        return users;
    },

    /**
     * @param {string} userId 
     * @param {string} currentUserId
     * @returns {Promise<Object>}
     */

    deleteUser: async (userId,currentUserId)=>{
        if (userId===currentUserId){
            throw new AppError('You cannot delete your own account',400);
        }

        const user = await userRepository.deleteById(userId);

        if (!user){
            throw new AppError('User not found',404);
        }

        logger.info(`User deleted: ${userId} by admin: ${currentUserId}`)
        return user;
    },

    /**
     * @param {string} userId
     * @param {Object} data 
     * @returns {Promise<Object>}
     */


    updateProfile: async (userId,data)=>{
        const sanitizedData = {};

        if (data.userName){
            sanitizedData.userName= data.userName;
        }

        if (Object.keys(sanitizedData).length===0){
            throw new AppError('No valid fields to update.',400);
        }

        const udpatedUser = userRepository.updateProfile(userId,sanitizedData);

        if (!udpatedUser){
            throw new AppError('User not found',404);
        }

        logger.info(`User profile updated: ${userId}`);
        return udpatedUser
    }


};


export default userService;
