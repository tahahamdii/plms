import userRefreshTokenModel from "../models/RefreshToken.js";
import UserModel from "../models/User.js";
import generateTokens from "./GenerateToken.js";
import VerifyRefreshToken from "./VerifyRefreshToken.js";

const RefreshToken = async(req,res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    // verify refreshToken is valid or not 
    const { tokenDetails, error} = await VerifyRefreshToken(oldRefreshToken);
    if(error){
        return res.status(401).json({ success: false, message: "Invalid RefreshToken"})
    };

    // Find user based on refresh token detail id
    const user = await UserModel.findById(tokenDetails._id);
    if(!user){
        return res.status(404).json({ success: false, message: "User not found"});
    }
    const userRefreshToken = await userRefreshTokenModel.findOne({ userId: tokenDetails._id });

    if(oldRefreshToken !== userRefreshToken.token){
        return res.status(401).json({ success: false, message: "Unauthorized Access"})
    }

    // all checks are cleared, generate new accessToken and refreshToken
    const {accessToken,refreshToken,accessTokenExp,refreshTokenExp} = await generateTokens(user);

    return {
        newAccessToken: accessToken,
        newRefreshToken: refreshToken,
        newAccessTokenExp: accessTokenExp,
        newRefreshTokenExp: refreshTokenExp
    };

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

export default RefreshToken