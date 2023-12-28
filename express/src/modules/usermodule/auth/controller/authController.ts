import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel";
import {
  validationForRestPassword,
  validationForSign_In,
  validationForSign_Up,
} from "../validations/userValidation";

import { object } from "joi";
import refreshTokenModel from "../models/refreshTokenModel";
import { sendEmail } from "../../../../utils/nodemailer";
import { sendSms } from "../../../../utils/twilio";
import otpModel from "../models/otpModel";
import { validationForOtp } from "../validations/otpValidation";
import { validationForUpdatePassword } from "../validations/changePasswordValidation";
import { I_usermodel } from "../models/userModel.interface";
import mongoose from "mongoose";

interface sendUser extends I_usermodel {
  _id: mongoose.Types.ObjectId;
}

// export const createUser= async(req,res)=>{

//     try{
//        await handler(req,res)
//     }
//     catch(error){
//         console.log(error)
//     }
// }

// const handler = (req,res)=>{

// }

export const createUser = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForSign_Up(req.body);

    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, phone } = value;
    const userAlreadyExists = await userModel.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    if (userAlreadyExists) {
      return res.status(402).send({ msg: "user already exists" });
    }
    const { password } = value;

    const epassword = await bcrypt.hash(password, 12);

    value.password = epassword;

    const userCreated = await userModel.create(value);
    return res.status(201).send({ msg: userCreated });
  }
);

export const userLogin = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {

    const { error, value } = validationForSign_In(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });

    const userFound = await userModel.findOne({
      $or: [{ email: value.email }, { phone: value.phone }],
    });
    console.log(userFound, "asdsad");

    if (userFound) {
      if (await bcrypt.compare(value.password, userFound.password)) {
        const { refresh, access } = await userTokens(userFound);
        res.cookie("refreshToken", refresh, {
          httpOnly: true,
          secure: true,
        });
        return res.status(200).send({
          token: access,
        });
      } else {
        return res.status(400).send({ msg: "Invalid Credentials" });
      }
    }
    return res.status(400).send({ msg: "User Not Found" });

  }
);

const userTokens = async (
  userFound: sendUser
): Promise<{ refresh: string | undefined; access: string }> => {
  const token = jwt.sign(
    { id: userFound._id, role: userFound.role },
    `${process.env.SECRETEKEY}`,
    { expiresIn: "15m" }
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

export const requestRefreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  console.log("idhr aa gaya hai", req.cookies.refreshToken);
  const value = req.cookies.refreshToken;
  if (!value) {
    return res.status(400).send({ msg: "token not found" });
  }

  const token = req.cookies.refreshToken;
  const refreshTokenAlreadyExists = await refreshTokenModel.findOne({
    refreshToken: token,
  });
  console.log(refreshTokenAlreadyExists, "token");
  if (refreshTokenAlreadyExists) {
    try {
      const payload = jwt.verify(token, `${process.env.REFRESHSECRETEKEY}`);

      if (typeof payload !== "object") {
        throw new Error();
      }
      const accesstoken = jwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 120, data: payload.data },
        `${process.env.SECRETEKEY}`
      );
      console.log(accesstoken, "tokenacessss");
      // console.log(accesstoken,"tokenacessss");
      return res.status(200).send({ token: accesstoken });
    } catch (err) {
      return res.status(204).send({ msg: "Log out" });
    }
  } else {
    return res.status(204).send({ msg: "Log out" });
  }
};



export const resetPassword = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForRestPassword(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    if (value.email) {
      const userFoundbyEmail = await userModel.findOne({ email: value.email });
      if (userFoundbyEmail) {
        const token = jwt.sign(
          { id: userFoundbyEmail._id, role: userFoundbyEmail.role },
          `${process.env.VERIFYSECRET}`,
          { expiresIn: "24h" }
        );
        const paramsToSend =
          process.env.CLIENTURL + token + "/userId/" + userFoundbyEmail.id;
        const emailSent = await sendEmail(
          userFoundbyEmail.email,
          "reset password",
          paramsToSend
        );
        return res
          .status(200)
          .send({ msg: "A Code has been sent to your email" });
      } else {
        return res.status(400).send({ msg: "User Not Found" });
      }
    } else {
      const userFoundbyPhone = await userModel.findOne({ phone: value.phone });
      if (userFoundbyPhone) {
        const randomValue: string = Math.random().toString().slice(2, 6);
        sendSms(`this is your code ${randomValue}`, userFoundbyPhone.phone);

        const otpAlreadyExists = await otpModel.findOne({
          userId: userFoundbyPhone._id,
        });

        if (otpAlreadyExists) {
          const updateOtp = await otpModel.findOneAndUpdate(
            { userId: userFoundbyPhone._id },
            { otp: randomValue },
            { new: true }
          );

          return res.status(200).send({
            msg: "A Code has been sent to your email",
            id: userFoundbyPhone._id,
          });
        } else {
          const otpCreated = await otpModel.create({
            otp: randomValue,
            userId: userFoundbyPhone._id,
            role: userFoundbyPhone.role,
          });
        }

        return res.status(200).send({
          msg: "A Code has been sent to your email",
          id: userFoundbyPhone._id,
        });
      } else {
        return res.status(400).send({ msg: "User Not Found" });
      }
    }
  }
);

export const otpVerify = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForOtp(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }
    const otpFoundAlongWithUser = await otpModel.findOne({
      otp: value.otp,
      userId: value.id,
    });
    if (otpFoundAlongWithUser) {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const updatedDate = new Date(otpFoundAlongWithUser.updatedAt);
      if (updatedDate > tenMinutesAgo) {
        const token = jwt.sign(
          { id: value.id },
          `${process.env.VERIFYSECRET}`,
          { expiresIn: "24h" }
        );
        const paramsToSend =
          process.env.CLIENTURL + token + "/userId/" + value.id;
        return res.status(200).send({ msg: paramsToSend });
      } else {
        return res.status(400).send({ msg: "otp expired" });
      }
    } else {
      return res.status(400).send({ msg: "Invalid User" });
    }
  }
);

export const changePassword = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const { error, value } = validationForUpdatePassword(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }
    const userFound = await userModel.findOne({ _id: value.id });

    if (userFound) {
      const payload = jwt.verify(value.token, `${process.env.VERIFYSECRET}`);

      if (typeof payload !== "object") {
        res.send({ msg: "invalidtoken" });
      }
      const { password } = value;

      const epassword = await bcrypt.hash(password, 12);

      const updateOtp = await userModel.findOneAndUpdate(
        { _id: userFound._id },
        { password: epassword },
        { new: true }
      );
      return res.status(200).send({ msg: "passwordUpdated", user: updateOtp });
    } else {
      return res.status(400).send({ msg: "User Not Found" });
    }
  }
);
