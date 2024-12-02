// Two types of Token are there
// 1. Access Token   : to access the credentials in frontend, like you are a valid user. Its duration is short
// 2. Refresh Token  : it re-generate the access token after it gets expired. 

import jwt from "jsonwebtoken";
import userRefreshTokenModel from "../models/RefreshToken.js";

const generateTokens = async(user) =>{
    try {
       const payload = { _id: user._id, roles: user.roles };

       // Generate accessToken with expiration Time 
       const accessTokenExp = Math.floor(Date.now() / 1000 + 100);   // 10 seconds

       const accessToken = jwt.sign(
        { ...payload, exp: accessTokenExp },
        process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
        );


        // Generate refreshToken with expiration Time 
        const refreshTokenExp = Math.floor(Date.now()/1000) + 60*60*24*5;   // 5days

        const refreshToken = jwt.sign(
            { ...payload, exp: refreshTokenExp },
            process.env.JWT_REFRESH_TOKEN_SECRET_KEY
        );

        // check if refreshToken is already there for this userId 
        const existingRefreshToken = await userRefreshTokenModel.findOneAndDelete({ userId: user._id });

        // save new refreshToken in database
        await new userRefreshTokenModel({
            userId: user._id,
            token: refreshToken
        }).save();


        return Promise.resolve({
            accessToken,
            refreshToken,
            accessTokenExp,
            refreshTokenExp
        });

    } catch (error) {
        return Promise.reject(error);
    }
};

export default generateTokens;