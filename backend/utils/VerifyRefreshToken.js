import jwt from "jsonwebtoken";
import userRefreshTokenModel from "../models/RefreshToken.js";


const VerifyRefreshToken = async(refreshToken) => {
    try {
        // find refresh token document 
        const userRefreshToken  = await userRefreshTokenModel.findOne({ token: refreshToken });

        // if refresh token not found 
        if(!userRefreshToken){
            throw { error: true, message: "Invalid Refresh token" };
        };

        // verify refresh Token 
        const tokenDetails = jwt.verify( refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET_KEY );

        return {
            tokenDetails,
            error: false,
            message: "Valid refresh Token"
        }
    } catch (error) {
        throw { error: true, message: "Invalid Refresh token" };
    }
}

export default VerifyRefreshToken