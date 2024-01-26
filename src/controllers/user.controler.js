import { asyncHandle } from "../utils/asyncHandle.js"


const registerUser = asyncHandle( async (req , res) => {
  return res.status(200).json({
    message : "OK"
  })
})

export {registerUser}
