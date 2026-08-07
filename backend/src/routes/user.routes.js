import { Router } from "express";
import {registerUser,loginUser,logoutUser,refreshAccessToken,updateAccount,updateAvatar,updatecoverImage,getuserchhanelprofile,getwatchhistory,changepassword,getcurrentuser,verifyOtp,resendOtp,forgotPasswordRequest,forgotPasswordReset } from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

import verifyjwt from "../middleware/auth.middleware.js";

const router = Router()
 router.route("/register").post( upload.fields([
    {
        name :"avatar",
        maxCount:1
    },
    {
       name :"coverImage",
       maxCount:1
    }
 ]) ,registerUser)
 router.route("/login").post(loginUser)
 router.route("/verify-otp").post(verifyOtp)
 router.route("/resend-otp").post(resendOtp)
 router.route("/forgot-password-request").post(forgotPasswordRequest)
 router.route("/forgot-password-reset").post(forgotPasswordReset)
 router.route("/logout").post(verifyjwt,logoutUser)
 router.route("/refresh-token").post(refreshAccessToken)
 router.route("/change-password").post(verifyjwt,changepassword)
 router.route("/current-user").get(verifyjwt,getcurrentuser)
 router.route("/update-account").patch(verifyjwt,updateAccount)
 router.route("/avatar").patch(verifyjwt,upload.single("avatar"),updateAvatar)
 router.route("/cover-image").patch(verifyjwt,upload.single("coverImage"),updatecoverImage)
 router.route("/c/:username").get(verifyjwt,getuserchhanelprofile)
 router.route("/history").get(verifyjwt,getwatchhistory)
export  default router