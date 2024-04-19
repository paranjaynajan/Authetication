import { Request, Response, NextFunction } from "express";
import multer from 'multer';
import jwt from "jsonwebtoken";
import fs from 'fs';
import { logger } from "../utils/server_services";
import userModel from "../modules/user/models/userModel";
import path from "path";
import { CustomError } from "./customError";
const redis = require("redis")

const redisClient = redis.createClient({
  host: "localhost", 
  port: 6379, 
});


const uploadPath = '../uploads';

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

export interface CustomRequest extends Request {
    user?: any
}



export const getTokenFromHeaders = (value: string) => {
    try {
        if (!value) {
            return null;
        }
        const tokenWithBrearer: string = value
        const token = tokenWithBrearer.split(" ")
        return token[1]
    } catch (err) {
        logger.error(err)
        throw err
        
    }
}

const myStorage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        const uploadDir = path.join(__dirname, '../uploads')
        cb(null, uploadDir);
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage: myStorage });


export const verifyToken = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const value = req.headers.authorization;
        if (!value) {
            throw new Error("No token found");
        }
        const token = getTokenFromHeaders(value);

        if (!token) {
            return res.status(401).send({ error: "Unauthorized", message: "Token validation failed" });
        }
       
        const JWT =  jwt.verify(token, `${process.env.SECRETEKEY}`) as {id: string};
        
        const userFound = await userModel.findById(JWT.id) 
        if(!userFound){
            throw new CustomError('User Not Found', 400);
        }
        req.user = userFound;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).send({ error: "Unauthorized", message: err || "Token expired or invalid" });
    }
};

export const userAuthorizedForAdmin = (async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const value = req.headers.authorization;
        if (!value) {
            throw new Error("No token found");
        }
        const token = getTokenFromHeaders(value);

        if (!token) {
            return res.status(401).send({ error: "Unauthorized", message: "Token validation failed" });
        }

        const payload: any = await jwt.verify(token, `${process.env.SECRETEKEY}`);

        if (typeof payload !== "object" || !payload.email) {
            throw new Error("Invalid payload");
        }

        const user = await userModel.findOne({ email: payload.email });

        if (!user) {
            throw new Error("User not found");
        }

        if (user.role !== 'admin') {
            return res.status(403).send({ error: "Forbidden", message: "User is not authorized for this action" });
        }

        req['user'] = user;

        next();
    } catch (err) {
        console.error(err);
        res.status(401).send({ error: "Unauthorized", message: "Token invalid or expired" });
    }

})


export const asyncMiddleware = (handler: (req: Request, res: Response, next: NextFunction) => Promise<Response>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
           await handler(req, res, next)

        }
        catch (error) {
            logger.error(error)
            if (error instanceof CustomError) {
             return res.status(error.statusCode).send({ error: error.message });}
            return res.status(500).send({ error: error });
        }
    }
}

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction)=>{

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const requests = await redisClient.incr(ip)
    let ttl 
    if(requests===1){
        await redisClient.expire(ip,60)
    }else{
        ttl=await redisClient.ttl(ip)
    }
    if(requests>1){
        return res.status(503).json({message:`ip is blocked for ${ttl} sec `})
    }else{
        next()
    }

}

