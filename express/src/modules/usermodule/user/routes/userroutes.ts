import express from "express"
import { profileUpdate, updateDetails, updatePassword,userMe,userSignOut } from "../controller/userController"
import { verifyToken } from "../../../../middlewares/verifyToken"
import { fileImage } from "../../../../middlewares/fileUpload"

const userRouter=express.Router()
userRouter.get("/signout",verifyToken,userSignOut)
userRouter.get("/me",verifyToken,userMe)
userRouter.post("/updatepassword",verifyToken,updatePassword)
userRouter.patch("/updatedetails",verifyToken,updateDetails)
userRouter.post("/updateprofile",verifyToken,fileImage.single('image'),profileUpdate)


export default userRouter