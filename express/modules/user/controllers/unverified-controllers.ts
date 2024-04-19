import { asyncMiddleware } from "../../../middlewares/middlewares";
import  { Express, Request, Response, } from "express";
import {
  findUserByEmailOrPhone,
  refreshTokenService,
  resetPasswordService,
  createUser,
  userTokens,
  redisServiceSetter,
  findUserById,
  redisServiceGetter,
} from "../services/unverified-services";
import { CustomError } from "../../../middlewares/customError";
import {
  validationForOtp,
  validationForRestPassword,
  validationForSign_In,
  validationForSign_Up,
} from "../validations/user-validations";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../../utils/nodemailer";
import { sendSms } from "../../../utils/twilio";
import { generateOTP } from "../../../utils/server_services";


//USER SIGNUP CONTROLLER
export const userSignUpController = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForSign_Up(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    const userAlreadyExists = await findUserByEmailOrPhone(value);
    if (userAlreadyExists) {
      throw new CustomError("User already exists", 402);
    }
    const { password } = value;
    const epassword = await bcrypt.hash(password, 12);
    value.password = epassword;
    const result = await createUser(value);
    return res.status(201).send(result);
  }
);

//USER SIGNIN CONROLLER
export const userSignInController = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForSign_In(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    const userFound = await findUserByEmailOrPhone(value);
    if (!userFound) {
      throw new CustomError("User Not Found", 400);
    }
    if (await bcrypt.compare(value.password, userFound.password)) {
      const { refresh, access } = await userTokens(userFound);
      res.cookie("refreshToken", refresh, {
        httpOnly: true,
        secure: true,
      });
      return res.status(201).send({
        token: access,
      });
    } else {
      throw new CustomError("Invalid Credentials", 400);
    }
  }
);

//REQUEST_TOKEN CONTROLLER
export const requestRefreshTokenController = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const value = req.cookies.refreshToken;
    if (!value) {
      throw new CustomError("token not found", 400);
    }
    const refreshTokenAlreadyExists = await refreshTokenService(value);
    if (refreshTokenAlreadyExists) {
      const payload = jwt.verify(value, `${process.env.REFRESHSECRETEKEY}`);

      if (typeof payload !== "object") {
        throw new Error("Not valid payload");
      }
      const accesstoken = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 120, ...payload},
        `${process.env.SECRETEKEY}`
      );
      return res.status(200).send({ token: accesstoken });
    } else {
      throw new CustomError("Invalid refersh token", 401);
    }
  }
);

//FORGET PASSWORD CONTROLLER
export const forgetPassword = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForRestPassword(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    const user = await resetPasswordService(value);
    if (!user) {
      throw new CustomError("user not found", 404);
    }
    const { refresh, access } = await userTokens(user);
    if (value.phone) {
      const otp = generateOTP();
      sendSms(`This is your code ${otp}`, user.phone);
      const ttlInSeconds = await redisServiceSetter(user._id, otp);
      return res
        .status(200)
        .send({
          message: `A Code has been sent to your phone will expier in ${ttlInSeconds} seconds`});
    } else {
      const paramsToSend =
        process.env.CLIENTURL + access + "/userId/" + user.id;
      const emailSent = await sendEmail(
        user.email,
        "reset password",
        paramsToSend
      );
      return res
        .status(200)
        .send({ message: "A Link has been sent to your email" });
    }
  }
);

//VERIFY OTP CONTROLLER
export const otpVerifyController = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForOtp(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
     const userFoundById=await findUserById(value.id)
     if (!userFoundById) {
      throw new CustomError("User Not Found", 400);
    }
    const { refresh, access } = await userTokens(userFoundById);

    const result = await redisServiceGetter(userFoundById._id);

    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: true,
    });
    return res.status(201).send({
      token: access,
    });
    
  });
