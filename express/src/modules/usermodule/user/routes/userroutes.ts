import express from "express"
import { updatePassword,userMe,userSignOut } from "../controller/userController"
import { verifyToken } from "../../../../middlewares/verifyToken"

const userRouter=express.Router()
userRouter.get("/signout",verifyToken,userSignOut)
userRouter.get("/me",verifyToken,userMe)
userRouter.post("/updatepassword",verifyToken,updatePassword)
userRouter.get("/signout",verifyToken,userSignOut)



export default userRouter