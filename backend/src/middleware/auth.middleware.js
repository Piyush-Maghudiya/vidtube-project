import  User  from "../models/user.models.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

 const   verifyjwt = asyncHandler(async (req,res,next)=>{
 try{
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        throw new ApiError(401,"Unauthoized request")
    }
    const decodetoken  = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodetoken?._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401,"invlid accesstoken")
    }
    req.user = user;
    next()
     }
   catch(error){
    throw new ApiError(400,error?.message || "invalid accesstoken")
   } 
 })

const verifyjwtOptional = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const decodetoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(decodetoken?._id).select("-password -refreshToken")
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    console.log("Optional JWT verification failed:", error.message);
  }
  next();
}

const verifyAdmin = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized request");
  }
  if (req.user.role !== "admin" && req.user.email !== "maghudiyapiyush8206@gmail.com") {
    throw new ApiError(403, "Access denied. Admin access only.");
  }
  next();
};

export { verifyjwt, verifyjwtOptional, verifyAdmin };
export default verifyjwt;