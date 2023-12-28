import { asyncMiddleware } from "../../../middlewares/asyncMiddleware";
import { Request, Response } from "express"

export const getAllProducts=asyncMiddleware(async(req:Request,res:Response): Promise<Response> =>{

return res.send("ok")
})