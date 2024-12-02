import express from "express";
import { changePassword, getNewAccessToken, logout, resetPassword, resetPasswordLink, userLogin, userProfile, userRegistration, verifyEmail } from "../controllers/userController.js";
import passport from "passport";
import AccessTokenAutoRefresh from "../middlewares/AccessTokenAutoRefresh.js";
import SetAuthHeader from "../middlewares/SetAuthHeader.js";
const router = express.Router();

router.post('/register',userRegistration);
router.post('/verify-email',verifyEmail);
router.post('/login',userLogin);
router.post('/refresh-token',getNewAccessToken);
router.post('/reset-password-link',resetPasswordLink);
router.post('/reset-password/:id/:token',resetPassword);

// Protected Routes
router.get('/profile', AccessTokenAutoRefresh, passport.authenticate('jwt', { session: false}), userProfile);
router.post('/change-password', AccessTokenAutoRefresh, passport.authenticate('jwt', { session: false}), changePassword);
router.post('/logout', AccessTokenAutoRefresh, passport.authenticate('jwt', { session: false}), logout);

export default router;