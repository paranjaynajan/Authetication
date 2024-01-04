import { NextFunction, Request, Response } from "express";
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware";
import refreshTokenModel from "../../auth/models/refreshTokenModel";
import jwt from "jsonwebtoken";
import {
  validationUserUpdate,
  validationUserUpdateAdhar,
} from "../validations/validationUserUpdate";
import userModel from "../../auth/models/userModel";
import { object } from "joi";
import { I_user } from "../../auth/validations/userValidation.interface";
import {
  I_userUpdateData,
  I_usermodel,
} from "../../auth/models/userModel.interface";
import { error } from "console";
import { ObjectId } from "mongoose";

export const updatePassword = () => {};

export const userSignOut = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const value = req.cookies.refreshToken;

    if (!value) {
      return res.status(400).send({ msg: "invalid token" });
    }
    const token = req.cookies.refreshToken;

    try {
      const payload = jwt.verify(token, `${process.env.REFRESHSECRETEKEY}`);

      if (typeof payload !== "object") {
        throw new Error();
      }
      const refreshTokenExistsDelete = await refreshTokenModel.deleteOne({
        userId: payload.id,
      });

      if (refreshTokenExistsDelete.deletedCount == 1) {
        res.clearCookie("refreshToken");
        return res.status(200).send({ msg: "Log out" });
      }
      return res.status(400).send({ msg: "Unauthorized" });
    } catch (err) {
      return res.status(400).send({ msg: err });
    }
  }
);

export const userMe = asyncMiddleware(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = await findUserWithPayload(req.headers.authorization);
    if (!user) {
      return res.status(400).send({ msg: "User not found" });
    }
    return res.status(200).send({ user });
  }
);

const findUserWithPayload = async (
  header: any
): Promise<string | I_userUpdateData> => {
  try {
    const userToken = header.split(" ");

    const payload = await jwt.verify(userToken[1], `${process.env.SECRETEKEY}`);
    if (typeof payload !== "object") {
      throw new Error("error verifying");
    }
    const user = await userModel.findOne({ _id: payload.id });
    if (!user) {
      return "user not found";
    }
    console.log(user);
    return user;
  } catch (error) {
    throw new Error("something went wrong");
  }
};

export const updateDetails = asyncMiddleware(
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const user = await findUserWithPayload(req.headers.authorization);
    if (typeof user === "string") {
      return res.status(200).send({ msg: "User not found" });
    }
    if (!user) {
      res.clearCookie("refreshToken");
      return res.status(400).send({ msg: "user not found" });
    }
    const check = user?.isUpdated;
    if (!check) {
      const { value, error } = validationUserUpdate(req.body);
      if (error) {
        return res.status(400).send({ msg: error.message });
      }
      const updateUser = await userModel.findOneAndUpdate(
        { _id: user?._id },
        { ...value, isUpdated: true },
        { new: true }
      );
      return res.status(200).send({ msg: updateUser });
    } else if (req.body.adharnumber || req.body.dob) {
      return res
        .status(400)
        .send({ msg: "DOB and AdharNumber cannot be updated." });
    } else {
      const { value, error } = validationUserUpdateAdhar(req.body);
      if (error) {
        return res.status(400).send({ msg: error.message });
      }
      const updateUser = await userModel.findOneAndUpdate(
        { _id: user?._id },
        { ...value, isUpdated: true },
        { new: true }
      );
      return res.status(200).send({ msg: updateUser });
    }
  }
);
