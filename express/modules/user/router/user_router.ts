import express, { Express,Request,Response, Router } from "express";
import { verifyToken } from "../../../middlewares/middlewares";
import { forgetPassword, otpVerifyController, requestRefreshTokenController, userSignInController, userSignUpController } from "../controllers/unverified-controllers";
import verifedRouter from "./verified_user_router";

export const userRouter= Router();
userRouter.post('/signup',userSignUpController)
userRouter.post('/signin',userSignInController)
userRouter.get('/refresh-token',requestRefreshTokenController)
userRouter.get('/otp-verify',otpVerifyController)
userRouter.post('/forgot-password',forgetPassword)
userRouter.use('/auth',verifyToken,verifedRouter);