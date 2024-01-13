import { v2 as cloudinary } from "cloudinary";
import fs  from 'fs'


cloudinary.config({
  cloud_name : process.env.CLOUNDINARY_CLOUD_NAME,
  api_key :process.env.CLOUNDINARY_API_KEY,
  api_secret:process.env.CLOUNDINARY_API_SECRET
});

const uploadOnCloundinary = async (localpath) =>{
  try {
   if(!localpath) return null
  const response = await cloudinary.uploader.upload(localpath,{
    resource_type :'auto'
   })
   console.log("file is uploaded in cloudinary",response.url)
   return response
  } catch (error) {
    fs.unlinkSync(localpath)
    return null

  }
}

export {uploadOnCloundinary}

