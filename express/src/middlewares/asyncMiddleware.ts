import { NextFunction, Request,Response } from "express"



export const asyncMiddleware=(handler:(req:Request,res:Response,next:NextFunction)=>Promise<Response>)=>{
    return async(req:Request,res:Response,next:NextFunction)=>{
        try{
           await handler(req,res,next)
        }
        catch(error){
          res.status(500).end()
            console.log(error)
        }
    }


}