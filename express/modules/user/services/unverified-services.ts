
import userModel from "../models/userModel";
import { CustomError } from "../../../middlewares/customError";
import refreshTokenModel from "../models/refreshTokenModel";
import jwt from "jsonwebtoken";

const redis = require("redis")

const redisClient = redis.createClient({
  host: "localhost", 
  port: 6379, 
});

let ttlInSeconds = 2 * 60


export const userTokens = async (
  userFound: any
): Promise<{ refresh: string | undefined; access: string }> => {
  const token = jwt.sign(
      { id: userFound._id, role: userFound.role },
      `${process.env.SECRETEKEY}`,
      { expiresIn: "10m" }
  );
  const refreshToken = jwt.sign(
      { id: userFound._id, role: userFound.role },
      `${process.env.REFRESHSECRETEKEY}`,
      { expiresIn: "24h" }
  );

  const refreshTokenAlreadyExists = await refreshTokenModel.findOne({
      userId: userFound._id,
  });

  if (refreshTokenAlreadyExists) {
      const updateRefreshToken = await refreshTokenModel.findOneAndUpdate(
          { userId: userFound._id },
          { refreshToken: refreshToken },
          { new: true }
      );
      return { refresh: updateRefreshToken?.refreshToken, access: token };
  } else {
      const refreshTokenCreated = await refreshTokenModel.create({
          refreshToken: refreshToken,
          userId: userFound._id,
          role: userFound.role,
      });

      return { refresh: refreshToken, access: token };
  }
};


export const findUserByEmailOrPhone= async (data:any)=>{
  const { email, phone } = data;
  return await userModel.findOne({
    $or: [{ email: email }, { phone: phone }],
  });
}

export const findUserById= async (id:any)=>{
  return await userModel.findById(id);
}

export const redisServiceSetter = async (id: any,otp:string): Promise<any> =>{
  redisClient.set(id,ttlInSeconds,"EX",otp, async (err:Error, reply:number) => {
    if (err) {
      throw new CustomError(err.message, 500);
    } else {
      ttlInSeconds= await redisClient.ttl(id)
      console.log("Value from Redis:", reply);
      return ttlInSeconds
    }
  });
}


export const redisServiceGetter = async (id: any): Promise<any> =>{
  redisClient.get(id, async (err:Error, reply:number) => {
    if (err) {
      throw new CustomError("Otp expired", 404);
    } else {
     return  reply;
    }
  })
}

//SERVICE FOR CREATE USER
export const createUser= async (data: any): Promise<any> => {
  const userCreated = await userModel.create(data);
  return { msg: userCreated };
};


export const  refreshTokenService = async (data: any): Promise<any> =>{
  return  await refreshTokenModel.findOne({
    refreshToken: data,
  });
}


export const resetPasswordService=async(data:any): Promise<any> =>{
 return data.email ? await userModel.findOne({email: data.email }) 
  : await userModel.findOne({ phone:data.phone });
}


