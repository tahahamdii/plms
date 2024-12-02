import transporter from "../config/emailConfig.js"
import { Verification_Email_Template } from "./OTP_TEMPLATE.js";
import EmailVerificationModel from "../models/EmailVerification.js";

const sendEmailVerificationOTP = async(req,user) => {
    // Generate 4 digit OTP 
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log("OTP: ",otp);
    
    // save otp to the database
    await new EmailVerificationModel({
        userId: user._id,
        otp,
    }).save();

    
    // OTP verification Link 
    const otpVerificationLink = `${process.env.FRONTEND_URL}/account/verify-email`;
    
    // Sending mail 
    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: user.email,
        subject: "Inceptum Verify Email", // Subject line
        html: Verification_Email_Template.replace("{verificationCode}",otp), // html body
      });
}

export default sendEmailVerificationOTP