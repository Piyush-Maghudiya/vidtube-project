import mongoose from "mongoose"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import  User  from "../models/user.models.js"
import {uploadoncloudinary,deleteFromCloudinary} from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import { response } from "express"
import { sendBrevoEmail } from "../utils/brevoEmail.js"

const generateAccesstokenAndRefreshtoken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccesstoken();
    const refreshToken = user.generateRefreshtoken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong when generating refresh and access tokens");
  }
}
const registerUser = asyncHandler(async (req,res) =>{
    //  take user data 
    // userr data validate
    // check user is alredy login
    // check  image and avatar
    // check image upload on cloudinary
    //  create object and entry in database
    //  remove password and refresh token from  response
    // check user creation
    // return response
    
        const {fullname,email,password ,username} = req.body || {}
        console.log("email : ",email)
        
        if(!fullname || !email || !password || !username){
          throw new ApiError(400, "All fields are required (fullname, email, password, username)")
        }

        // Password validation: minimum 6 characters and at least one symbol
        if (password.length < 6) {
          throw new ApiError(400, "Password must be at least 6 characters long")
        }
        const symbolRegex = /[!@#$%^&*(),.?":{}|<>_\W]/;
        if (!symbolRegex.test(password)) {
          throw new ApiError(400, "Password must contain at least one symbol")
        }

        const exituser =  await User.findOne({
          $or: [{ username},{email}]
        })
        if(exituser){
          throw new ApiError(409,"username and email already exist")
        }
 
         const avatarlocalpath = req.files?.avatar?.[0]?.path;
        //  const coverImagelocalpath = req.files?.coverImage?.[0]?.path;

        let coverImagelocalpath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
          coverImagelocalpath = req.files.coverImage[0].path;
        }

         if(!avatarlocalpath){
            throw new ApiError(400,"avatar is requiired")
         }

        const avatar = await uploadoncloudinary(avatarlocalpath)
        const coverImage = await uploadoncloudinary(coverImagelocalpath)
        if(!avatar){
         throw   new ApiError(400,"avatar is required")
        }
        
     const user = await User.create({
            username:username.toLowerCase(),
            fullname,
            password,
            email,
            avatar:{
              url:avatar.url,
              public_id:avatar.public_id
            },
            coverImage :{
              url:coverImage?.url || "",
              public_id:coverImage?.public_id || ""
            },
        })
         const createduser = await User.findById(user._id).select("-password -refreshToken")

        if(!createduser){
            throw new ApiError(500,"somthing went wrong while creatinng user")
        }

        const {accessToken,refreshToken} =  await generateAccesstokenAndRefreshtoken(user._id)

        const options = {
          httpOnly  :true,
          secure: true,
          sameSite: "none"
        }

        return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
             new ApiResponse(
               200, 
               {
                 user: createduser,
                 accessToken,
                 refreshToken
               }, 
               "user registration successfully"
             )
        )
})


  const loginUser = asyncHandler( async (req,res)=>{
      // data from req -> body
      // user login eamil,username
      // find user
      // password check 
      // access and refresh token generate
      console.log(req.body);
      const  {username,email,password} = req.body
      if(!username && !email ){
        throw new ApiError(404,"username or email required")
      }
       const user = await User.findOne({
        $or: [{ username }, { email }]
      });
      if(!user){
        throw new ApiError(400,"user not found")
      }
      const passwordvalid = await user.passwordcorrect(password)
      if(!passwordvalid){
         throw new ApiError(401,"Password is invalid,enter corret password")
      }

      // Generate OTP for login
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
      await user.save({ validateBeforeSave: false });

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
            <h2 style="color: #a855f7; text-align: center; border-bottom: 2px solid #a855f7; padding-bottom: 10px;">VidTube Platform</h2>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">Please use the following OTP to log in to your account:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6b21a8; background-color: #faf5ff; padding: 12px 28px; border-radius: 8px; border: 1px solid #e9d5ff; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 30px;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">VidTube Platform &copy; 2026</p>
        </div>
      `;
      sendBrevoEmail(user.email, "VidTube - Login OTP Verification", htmlContent);

      return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            otpRequired: true,
            email: user.email
          },
          "A 6-digit login verification OTP has been sent to your email."
        )
      )
  })
  
  const logoutUser = asyncHandler( async (req,res) =>{
      await User.findByIdAndUpdate(req.user._id,{
        $set :{
          refreshToken:undefined
        } 
      }, 
      {
         new :true
      }

    )
    const options = {
      httpOnly:true,
      secure: true,
      sameSite: "none"
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))
  }) 

  const refreshAccessToken = asyncHandler(async (req,res)=>{
     const incomingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken
     if(!incomingrefreshtoken){
      throw new ApiError(400,"unauthorized request")
     }

    try{
     const decodetoken =  jwt.verify(incomingrefreshtoken ,process.env.REFRESH_TOKEN_SECRET)
      const user = await User.findById(decodetoken?._id) 
      if(!user){
         throw new ApiError(401,"invalid Token")
      }

      if(incomingrefreshtoken !== user?.refreshToken){
        throw new ApiError(401,"refreshtoken is expired or used")
      }

      const{accessToken, refreshToken: newrefreshToken} =  await generateAccesstokenAndRefreshtoken(user._id)

      const options = {
        httpOnly:true,
        secure: true,
        sameSite: "none"
      }

      res
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",newrefreshToken,options)
      .json( new ApiResponse(
        200,
        {
          accessToken,refreshToken : newrefreshToken
        },
        "acccess token refreshed"
      ))
      }
      catch(error){
      throw new ApiError(401,error?.message || "invalid refreshtoken")
      }
  })
 const changepassword = asyncHandler( async (req,res)=>{
    const {oldpassword,newpassword,confpassword} = req.body
      const user = await User.findById(req.user?._id)
     const ispasswordcorrect = await user.passwordcorrect(oldpassword)
     if(!ispasswordcorrect){
       throw new ApiError(400,"invalid old password")
     }
      if(!(confpassword === newpassword)){
        throw new ApiError(400,"new and confirm password must be same")
      }

      // Password validation: minimum 6 characters and at least one symbol
      if (newpassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long")
      }
      const symbolRegex = /[!@#$%^&*(),.?":{}|<>_\W]/;
      if (!symbolRegex.test(newpassword)) {
        throw new ApiError(400, "New password must contain at least one symbol")
      }
     user.password =newpassword 
     await user.save({validateBeforeSave:false})

     res
     .status(200)
     .json(new ApiResponse(
       200,
       {},
       "password changed successfully"
     ))

 }) 
 const getcurrentuser = asyncHandler(async (req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,req.user,"current user fetch successfully"))
 })

 const updateAccount = asyncHandler(async (req,res)=>{
      const {fullname,email}  = req.body

      if(!fullname || !email){
        throw new ApiError(401,"fulllname and userrname must be required")
      }
      
     const user = await User.findByIdAndUpdate(
        req.user?._id,
        { $set:{
          fullname:fullname,
          email:email
        }},
        {new : true}).select("-password")
       
        return res
        .status(200)
        .json(new ApiResponse(200,user,"fullname and email changed succesfully"))
 } )

 const updateAvatar = asyncHandler(async (req,res)=>{
   const avatarlocalpath = req.file?.path
   if(!avatarlocalpath){
    throw new ApiError(401,"avatar must required")
   }
 const user = await User.findById(req.user._id).select("avatar")
   const avatar = await uploadoncloudinary(avatarlocalpath)

     if (!avatar?.url) {
    throw new ApiError(500, "Error uploading avatar");
  }
    const deleteavatar = user?.avatar?.public_id

    const  updateuser = await  User.findByIdAndUpdate(
    req.user?._id,
    { $set :{
      avatar : {
        url:avatar.url,
        public_id:avatar.public_id
      }
    }},
    {new :true}
   ).select("-password")
  if(!updateuser){
    throw new ApiError(400,"something went wrong when update avatar")
  }
  if(updateuser){
    await deleteFromCloudinary(deleteavatar)
  }
   return res
   .status(200)
   .json(new ApiResponse(
    200,
    updateuser,
    "avatar upadated successfully"
   ))
 })

  const updatecoverImage = asyncHandler(async (req,res)=>{
   const coverImagelocalpath = req.file?.path
   if(!coverImagelocalpath){
    throw new ApiError(401,"coverImage must required")
   }

    const coverImage = await uploadoncloudinary(coverImagelocalpath)
     if (!coverImage?.url) {
    throw new ApiError(500, "Error uploading avatar");
  }
   const user = await  User.findById(req.user._id).select("coverImage")

    const oldcoverImage = user?.coverImage?.public_id

    const  updateuser =  await User.findByIdAndUpdate(
    req.user?._id,
    { $set :{
      coverImage : {
        url:coverImage.url,
        public_id:coverImage.public_id
      }
    }},
    {new :true}
   ).select("-password")
   
   if(!updateuser){
    throw  new ApiError(400,"somthing went wrong when upadate coverImage")
   }
   if(oldcoverImage){
     await deleteFromCloudinary(oldcoverImage)
   }
   return res
   .status(200)
   .json(new ApiResponse(
    200,
    updateuser,
    "coverImage upadated successfully"
   ))
  })

   const getuserchhanelprofile = asyncHandler(async (req,res) => {
       const {username} = req.params
     if(!username?.trim()){
      throw new ApiError(400,"username is missing")
     }

        const getchhanledetail = await User.aggregate([
      {
       $match :{
       username :username?.toLowerCase()
       }
     },
     {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"channel",
        as:"subscribers"

      }
     },
     {
      $lookup:{
        from:"subscriptions",
        localField:"_id",
        foreignField:"subscriber",
        as:"subscribed"
      }
     },
     {
      $lookup:{
        from:"videos",
        localField:"_id",
        foreignField:"owner",
        as:"videos"
      }
     },
     {
      $addFields :{
        subscribercount : {
          $size :"$subscribers"
        },
        chhanelsubscribedtocount : {
         $size:"$subscribed"
        },
        // button ma subcribe ke subscribed batadavu aena mate
        issubcribed : {
          $cond :{
            if:{$in:[ req.user?._id ,"$subscribers.subscriber"]},
            then:true,
            else:false
          }
        }
      }
     },
     {
      $project:{
        fullname:1,
        email:1,
        avatar:1,
        coverImage:1,
        subscribercount :1,
        chhanelsubscribedtocount:1,
        issubcribed:1,
        username:1,
        videos:1
      }
     }
    ])

   if(!getchhanledetail?.length){
    throw new ApiError(400,"channel does not exit")
   }
   return res
   .status(200)
   .json(
     new ApiResponse(200,
      getchhanledetail[0],
      "channel detail  fetched successfully"
     )
   )
   })
 
    const getwatchhistory  = asyncHandler(async (req,res) => {
      const user = await User.aggregate([
        {
          $match :{
            _id : new mongoose.Types.ObjectId(req.user?._id)
          }
        },
        {
          $lookup:{
            from : "videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"watchHistory",
            pipeline:[
              {
                $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                 { 
                  $project:{
                     fullname:1,
                     username:1,
                     avatar:1
                  }
                }
                ]                
              }
           },
           {
          $addFields:{
            owner:{
              $first : "$owner"
               }
             }
           }
           ]
          }
        },
        
      ])
      if (!user?.length) {
    throw new ApiError(404, "User not found");
  }
      return res
      .status(200)
      .json(
        new ApiResponse(200,
          user[0].watchHistory,
          "watchHistory fetched succesfully")
      )
    })

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP code");
    }

    if (new Date() > user.otpExpiry) {
        throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    // Generate tokens to log them in automatically
    const { accessToken, refreshToken } = await generateAccesstokenAndRefreshtoken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -otp -otpExpiry");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "Email verified and user logged in successfully"
            )
        );
});

const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save({ validateBeforeSave: false });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
            <h2 style="color: #a855f7; text-align: center; border-bottom: 2px solid #a855f7; padding-bottom: 10px;">VidTube Platform</h2>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">Please verify your email using the verification code below:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6b21a8; background-color: #faf5ff; padding: 12px 28px; border-radius: 8px; border: 1px solid #e9d5ff; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">This code is valid for 10 minutes. Please do not share this OTP with anyone.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 30px;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">VidTube Platform &copy; 2026</p>
        </div>
    `;
    sendBrevoEmail(user.email, "VidTube - OTP Verification", htmlContent);

    return res
        .status(200)
        .json(new ApiResponse(200, { email: user.email }, "Verification OTP resent successfully"));
});

const forgotPasswordRequest = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        throw new ApiError(404, "User with this email does not exist");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save({ validateBeforeSave: false });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
            <h2 style="color: #a855f7; text-align: center; border-bottom: 2px solid #a855f7; padding-bottom: 10px;">VidTube Platform</h2>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; color: #333333; line-height: 1.5;">You requested a password reset. Please use the verification code below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #6b21a8; background-color: #faf5ff; padding: 12px 28px; border-radius: 8px; border: 1px solid #e9d5ff; display: inline-block;">
                    ${otp}
                </span>
            </div>
            <p style="font-size: 14px; color: #6b7280; text-align: center;">This code is valid for 10 minutes. If you did not request this, you can safely ignore this email.</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin-top: 30px;" />
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">VidTube Platform &copy; 2026</p>
        </div>
    `;
    sendBrevoEmail(user.email, "VidTube - Password Reset OTP", htmlContent);

    return res
        .status(200)
        .json(new ApiResponse(200, { email: user.email }, "Password reset OTP has been sent to your email."));
});

const forgotPasswordReset = asyncHandler(async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
        throw new ApiError(400, "All fields (email, otp, newPassword, confirmPassword) are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Passwords do not match");
    }

    // Password validation: minimum 6 characters and at least one symbol (same as changepassword rules)
    if (newPassword.length < 6) {
        throw new ApiError(400, "New password must be at least 6 characters long")
    }
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>_\W]/;
    if (!symbolRegex.test(newPassword)) {
        throw new ApiError(400, "New password must contain at least one symbol")
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (user.otp !== otp) {
        throw new ApiError(400, "Invalid OTP code");
    }

    if (new Date() > user.otpExpiry) {
        throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password has been reset successfully. Please log in with your new password."));
});

export {registerUser,loginUser,logoutUser,refreshAccessToken,updateAccount,updateAvatar,updatecoverImage,getuserchhanelprofile,getwatchhistory,changepassword,getcurrentuser,verifyOtp,resendOtp,forgotPasswordRequest,forgotPasswordReset}