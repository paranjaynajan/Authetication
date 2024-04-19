import express, { Express,Request,Response, Router } from "express";
import { fetchMeController, updateImageController, updatePasswordController, userLogoutController } from "../controllers/verified-controller";
import { upload, userAuthorizedForAdmin } from "../../../middlewares/middlewares";



const verifedRouter=Router()
verifedRouter.get('/logout',userLogoutController)
verifedRouter.post('/reset-password',updatePasswordController)
verifedRouter.post('/upload',upload.single("profile_image"),updateImageController)
verifedRouter.get('/me',fetchMeController)
verifedRouter.get('/all-users',userAuthorizedForAdmin,(req,res)=>{})

export default  verifedRouter