import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandle } from "../utils/asyncHandle";
import { jwt } from "jsonwebtoken";

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