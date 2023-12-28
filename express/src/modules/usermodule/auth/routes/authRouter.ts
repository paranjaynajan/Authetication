import {Router} from "express"
import { createUser,requestRefreshToken,userLogin,resetPassword, otpVerify,changePassword } from "../controller/authController"

const authRouter=Router()
authRouter.post("/signup",createUser)
authRouter.post("/signin",userLogin)
authRouter.post("/otpverify",otpVerify)
authRouter.post("/resetpassword",resetPassword)
authRouter.post("/changepassword",changePassword)
authRouter.get('/refresh-token',requestRefreshToken)
// authRouter.get("/signout",userSignOut)

export default authRouter
