import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandle } from "../utils/asyncHandle.js";
import pkg from 'jsonwebtoken';
const { jwt } = pkg;

export const verifyJWT = asyncHandle(async(req, res ,next)=>{

  try {
    req.coolies?.accessToken || req.header("Authorization")?.replace("Bearer","")

    if(!token) {
      throw new ApiError(401 ,"UnAthorized request")
    }

const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

 const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

 if(!user) {
  throw new ApiError(401 , "Invalid Access Token")
 }

 req.user = user;
 next()
}
catch (error) {
  throw new ApiError(401 , error?.message || "Inalid AccessToken")
}
}

)
