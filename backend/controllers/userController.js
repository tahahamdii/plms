import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import sendEmailVerificationOTP from "../utils/sendEmailVerificationOTP.js";
import EmailVerificationModel from "../models/EmailVerification.js";
import generateTokens from "../utils/GenerateToken.js";
import setTokenCookies from "../utils/setTokenCookies.js";
import RefreshToken from "../utils/RefreshToken.js";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "../utils/RESET_PASSWORD_TEMPLATE.js";

// User Registration
export const userRegistration = async(req,res) =>{
    try {
        const {name,email,password,password_confirmation} = req.body;

        // check if all are Provided or not
        if(!name || !email || !password || !password_confirmation){
            return res.status(400).json({ success: false, message: "All fields are required" });
        };

        // check if both password & Confirm Password are same or not
        if(password !== password_confirmation){
            return res.status(400).json({ success: false, message: "Password and Confirm Password are not same" });
        };

        // check if the user already exists or not 
        const existingUser = await UserModel.findOne({email});
        if(existingUser) {
            return res.status(409).json({ success: false, message: "Email already exits" });
        }

        // Generate salt & Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        // create newUser
        const newUser = await new UserModel({
            name,
            email,
            password:hashedPassword
        }).save();

        // Sending OTP on Email
        sendEmailVerificationOTP(req,newUser);

        return res.status(201).json({ success:true, message: "User Register Successfully", 
            user: {
                id: newUser._id,
                email: newUser.email
                } 
        });

    } catch (error) {
       console.error(error);
       return res.status(500).json({ success: false, message: error.message });
    }
};


// User Email Verification 
export const verifyEmail = async(req,res)=>{
    try {
       const {email,otp} = req.body;

       // check if the email and otp are provided or not 
       if(!email || !otp){
        return res.status(400).json({ success: false, message: "All fields are required" });
       };

       // check if the user already exists or not
       const existingUser = await UserModel.findOne({email});
       if(!existingUser){
        return res.status(404).json({ success: false, message: "Email doesn't exits" });
       };

       // check if the user is already verified or not 
       if(existingUser.isVerified){
        return res.status(400).json({ success: false, message: "Email is already verified" });
       };

       // check if there is a matching email verification OTP or not 
       const emailVerification = await EmailVerificationModel.findOne({
        userId: existingUser._id,
        otp,
       });
       if(!emailVerification){
        if(!existingUser.isVerified){
            await sendEmailVerificationOTP(req,existingUser);
            return res.status(400).json({ success: false, message: "Invalid OTP, new OTP sent to your email" });
        }
        return res.status(400).json({ success: false, message: "Invalid OTP" });
       };

       // check if OTP expired or not 
       const currentTime = new Date();
       const expirationTime = new Date(emailVerification.createdAt.getTime() + 15*60*1000);

       if(currentTime > expirationTime){
        // OTP expired, send new OTP 
        await sendEmailVerificationOTP(req,existingUser);
        return res.status(400).json({ success: false, message: "OTP Expired, new OTP sent to your email" });
       };

       // All checks are cleared, mark email as verified
       existingUser.isVerified = true;
       await existingUser.save();

       // Delete email verification document 
       await EmailVerificationModel.deleteMany({ userId: existingUser._id });
       return res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// User Login 
export const userLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;

        // check all fields are provided or not 
        if(!email || !password){
            return res.status(400).json({ success: false, message: "All fields are required" });
        };

        // check if the user is already exits or not 
        const existingUser = await UserModel.findOne({email});
        
        // if user is not in the database
        if(!existingUser){
            return res.status(404).json({ success: false, message: "Invalid email or password" });
        }

        // if user is verified or not 
        if(!existingUser.isVerified){
            return res.status(401).json({ success: false, message: "Your account is not verified" });
        };

        // check password is correct or not 
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        };

        // Generate Token
        const { accessToken,refreshToken,accessTokenExp,refreshTokenExp} = await generateTokens(existingUser);

        // Set Cookie
        setTokenCookies(res, accessToken,refreshToken,accessTokenExp,refreshTokenExp );

        // Send Success Response 
        return res.status(200).json({
            user: { id: existingUser._id, email: existingUser.email, name: existingUser.name, roles: existingUser.roles[0] },
            success: true,
            message: "Login successfull",
            access_Token: accessToken,
            refresh_Token: refreshToken,
            access_Token_Exp: accessTokenExp,
            is_auth: true,
        });


    } catch (error) {
       console.error(error);
       return res.status(500).json({ success: false, message: error.message });
    }
};


// Get new AccessToken using Refresh Token 
export const getNewAccessToken = async(req,res)=>{
    try {
        // get new accesstoken using refresh token 
        const {newAccessToken,newRefreshToken,newAccessTokenExp,newRefreshTokenExp} = await RefreshToken(req,res)

        // set new token to cookie
        setTokenCookies(res, newAccessToken,newRefreshToken,newAccessTokenExp,newRefreshTokenExp );

        return res.status(200).json({
            success: true,
            message: "New token generated",
            access_Token: newAccessToken,
            refresh_Token: newRefreshToken,
            access_Token_Exp: newAccessTokenExp
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// User Profile 
export const userProfile = async(req,res)=>{
   res.send({"User: ": req.user})
};


// Logout 
export const logout = async(req,res)=>{
    try {
        // clear accessToken and refreshToken cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.clearCookie('is_auth');

        return res.status(200).json({ success:false, message: "Logout successfull" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Change Password 
export const changePassword = async(req,res)=>{
    try {
        const { password, password_confirmation } = req.body;

        // check if both are provided or not
        if(!password || !password_confirmation){
            return res.status(400).json({ success: false, message: "All fields are required" });
        };

        // check if both password and confirm password are same or not 
        if(password !== password_confirmation){
            return res.status(400).json({ success: false, message: "Password and Confirm Password are not same" });
        };

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const newhashedPassword = await bcrypt.hash(password,salt);

        // Update user's password
        await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: newhashedPassword } });

        // send response 
        return res.status(200).json({ success: true, message: "Password changed successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Send Password Reset Link via Email 
export const resetPasswordLink = async(req,res)=>{
    try {
        const {email} = req.body;
        
        // check if email is provided or not 
        if(!email){
            return res.status(400).json({ success: false, message: "Email are required" });
        };

        const existingUser = await UserModel.findOne({email});
        // if its not existingUser, Register your account 
        if(!existingUser){
            return res.status(400).json({ success: false, message: "Email doesn't exist" });
        };

        // Generate token for password reset 
        const secret = existingUser._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
        const token = jwt.sign({ userID: existingUser._id }, secret, {expiresIn: '5m'});

        // Reset Link 
        const resetLink = `${process.env.FRONTEND_URL}/account/reset-password-confirm/${existingUser._id}/${token}`;
        console.log(token);
        console.log(existingUser._id);

        // send password reset Email 
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // sender address
            to: existingUser.email,
            subject: "Password Reset Link", // Subject line
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetLink), // html body
          });

          // send response 
          return res.status(200).json({ success: true, message: "Reset Password Link sent" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


// Password Reset 
export const resetPassword = async(req,res)=>{
    try {
       const {password, password_confirmation} = req.body;
       const {id, token} = req.params;

       // check if both are provided or not
       if(!password || !password_confirmation){
        return res.status(400).json({ success: false, message: "All fields are required" });
        };

        // check if both password and confirm password are same or not 
        if(password !== password_confirmation){
            return res.status(400).json({ success: false, message: "Password and Confirm Password are not same" });
        };

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const newhashedPassword = await bcrypt.hash(password,salt);

        // Find user by ID 
        const user = await UserModel.findById(id);
        if(!user){
            return res.status(404).json({ success: false, message: "User not found" });
        };

        // validate token
        const new_secret = user._id + process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
        jwt.verify(token,new_secret);

        // Update new Password to database 
        await UserModel.findByIdAndUpdate(user._id, { $set: { password: newhashedPassword } });

        // send response 
        return res.status(200).json({ success: true, message: "Password reset successfully"});
        
    } catch (error) {
        if(error.name === 'TokenExpiredError'){
            return res.status(400).json({ success: false, message: "Token Expired. Please request a new password reset link" });

        }
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};