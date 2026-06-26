
import AppError from "../utils/AppError.js"
import { verifyRefreshToken } from "../utils/token.js";


const authService = {
    refreshAccessToken: async (oldRefreshToken)=>{
        if (!oldRefreshToken){
            throw new AppError('Refresh Token is required',401);
        }

        let payload;

        try{
            payload = verifyRefreshToken()
        }
    }
}