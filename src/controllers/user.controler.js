import { asyncHandle } from "../utils/asyncHandle.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloundinary } from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js";


const registerUser = asyncHandle( async (req , res) => {
    const {fullName , email , username , password} = req.body
    console.log("Fullname==>",fullName)

    if (
      [fullName , email, username, password].some((field)=>
    field?.trim() === "")
    ) {
      throw new ApiError(400,"All Field is required")
    }

    const existUser = User.findOne({
      $or: [{username} ,  {email}]
    })

    if(existUser) {
      throw new ApiError(409 , "User with email or username already exists")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) {
      throw new ApiError(400 ,"Avatar file is required")
    }


    const avatar = await uploadOnCloundinary(avatarLocalPath);
    const coverImage = await uploadOnCloundinary(coverImageLocalPath);

    if(!avatar) {
      throw new ApiError(400 , "Avatar file is required")
    }


})

export {registerUser}
