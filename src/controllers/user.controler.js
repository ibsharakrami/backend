import { asyncHandle } from "../utils/asyncHandle.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloundinary } from "../utils/cloudnary.js"
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandle( async (req , res) => {
    const {fullname , email , username , password} = req.body
    console.log("Fullname==>",fullname)

    if (
      [fullname , email, username, password].some((field)=>
    field?.trim() === "")
    ) {
      throw new ApiError(400,"All Field is required")
    }

    const existUser = await User.findOne({
      $or: [{username} ,  {email}]
    })

    if(existUser) {
      throw new ApiError(409 , "User with email or username already existssss")
    }

    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
       coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath) {
      throw new ApiError(400 ,"Avatar file is required")
    }


    const avatar = await uploadOnCloundinary(avatarLocalPath);
    const coverImage = await uploadOnCloundinary(coverImageLocalPath);

    if(!avatar) {
      throw new ApiError(400 , "Avatar file is required")
    }
    // if(!coverImage) {
    //   throw new ApiError(400 , "coverImage file is required")
    // }
    const user =await User.create({
      fullname,
      avatar : avatar.url,
      coverImage :coverImage?.url || "",
      email,
      password,
      username  : username.toLowerCase()
    })

   const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createUser) {
    throw new ApiError(500 ,"Something went wrong while registering the user")
   }

   return res.status(201).json(
     new ApiResponse(200 , createUser , "User Register Successfully")
   )




})

const generateAccessAndRefereshTokens = async(userId) => {
   try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({validateBeforeSave : false})

        return {accessToken, refreshToken  }

   }catch(error) {
    throw new ApiError(500 ,"Something went wrong while generating refresh and access token")
   }
}


const loginUser = asyncHandle( async (req , res) => {
  const {email , username , password} = req.body

  if(!username || !email) {
    throw new ApiError(400 ,"Username or email is required")
  }

  const user = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!user) {
    throw new ApiError(404 ,"USer does not exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if(!isPasswordValid) {
    throw new ApiError(401 ,"Invalid user credentails")
  }
  const {accessToken , refreshToken} = await generateAccessAndRefereshTokens(user._id)

  const LoggedInUser = User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure : true
 }

 return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
  new ApiResponse(
    200,
    {
      user : LoggedInUser ,accessToken ,refreshToken

    },
    "User logged in Successfully"
  )
 )

})

const logoutUser = asyncHandle(async(req ,res) =>{
    await User.findByIdAndUpdate(
      req.user._id,{
        $set :{
          refreshToken : undefined
        }
      },
      {
        new: true
      }
    )
    const options = {
      httpOnly : true,
      secure : true
   }

   return res
   .status(200)
   .clearCookie("accessToken",options)
   .clearCookie("refreshToken",options)
   .json(new ApiResponse(200 ,{},"User logged Out"))
})


export {registerUser , loginUser , logoutUser}
