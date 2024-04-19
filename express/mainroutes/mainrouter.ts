import express, { Express,Request,Response, Router } from "express";
import { userRouter } from "../modules/user/router/user_router";


const mainRouter = Router()
mainRouter.use('/',userRouter)


export default mainRouter; 