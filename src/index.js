// require('dotenv').config({path :'./env'})

import connectDB from "./db/index.js";
import { app } from "./app.js";



connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000,()=>{
    console.log(`@ Server is running at port : ${process.env.PORT}`)
  })
})
.catch((err)=>{
  console.log("MONGODB Connection failed!!!" , err)
})



// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";


// ;(async ()=>{
//   try {
//    await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`)
//   }catch(error) {
//     console.error("ERROR",error)
//     throw error
//   }
// })()
