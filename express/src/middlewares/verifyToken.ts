import { Request, Response,NextFunction } from "express"
import jwt from "jsonwebtoken"
import Joi from "joi"
import userModel from "../modules/usermodule/auth/models/userModel"
// import userModel from "../modules/user/models/userModel"

const validationForToken = (token:unknown) => {
if(typeof token=="string"){
  const validate = Joi.string().required()
  return validate.validate(token)
}

}

export const verifyToken = (async(req: Request, res: Response,next:NextFunction) => {

    const value  = req.headers.authorization
    if (!value) {
        return res.status(400).send('token validation failed')
    }
    const tokenWithBrearer: string = value
    const token = tokenWithBrearer.split(" ")
    try{
      console.log(token[1],process.env.SECRETEKEY,'coming here in catch')
      const JWT= await jwt.verify(token[1], `${process.env.SECRETEKEY}`) ;
      
      next()
    }catch(err){
     console.log('jumping here')
      res.status(403).send({msg:"token expired"})
    }
     
          

})
