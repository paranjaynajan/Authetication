import { CustomError } from "../../../middlewares/customError";
import { CustomRequest, asyncMiddleware } from "../../../middlewares/middlewares";
import  { Express, Request, Response,} from "express";
import {
  fetchMeService,
  updateImageService,
  userLogoutService,
  userPasswordUpdateService,
} from "../services/verified-services";
import jwt from "jsonwebtoken";
import { validationForUpdatePassword } from "../validations/user-validations";
import bcrypt from "bcrypt";
import path from "path";

//USER LOGOUT CONTROLLER
export const userLogoutController = asyncMiddleware(
  async (req: Request, res: Response): Promise<Response> => {
    const value = req.cookies.refreshToken;
    if (!value) {
      throw new CustomError("Invalid token", 400);
    }
    const payload = jwt.verify(value, `${process.env.REFRESHSECRETEKEY}`);
    if (typeof payload !== "object") {
      throw new Error("Invalid token");
    }
    const refreshTokenExistsDelete = await userLogoutService(payload.id);
    if (refreshTokenExistsDelete.deletedCount == 1) {
      res.clearCookie("refreshToken");
      return res.status(200).send({ message: "Log out" });
    }
    throw new CustomError("Unauthorized", 401);
  }
);

//UPDATE PASSWORD CONTROLLER
export const updatePasswordController = asyncMiddleware(
  async (req: CustomRequest, res: Response): Promise<Response> => {
    const {user} = req
    if(!user){
      throw new CustomError("Unauthorized", 401);
    }
    const { error, value } = validationForUpdatePassword(req.body);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    const { password } = value;
     const epassword = await bcrypt.hash(password, 12);
    const updatedPassword = await userPasswordUpdateService(user.id,epassword);
      if (updatedPassword) {
     return res.status(200).send({ msg: "passwordUpdated", user: updatedPassword });
      }
      throw new CustomError("User Not Found", 404);   
  }
);

//USER IMAGE UPLOAD CONTROLLER
export const updateImageController = asyncMiddleware(
  async (req: CustomRequest, res: Response): Promise<Response> => {
    const {user} =req
    if(!user){
      throw new CustomError("Unauthorized", 401);
    }
    if (!req.file) {
      throw new CustomError("Image is required", 400);
    }
    // const fileName = path.join(process.cwd(),`uploads/${req.file.filename}`
    const fileName = req.protocol + '://' + req.headers.host + '/' + `uploads/${req.file.filename}`

console.log(fileName,"contoller")
      const updatedUser = await updateImageService(user.id,fileName);
      if (updatedUser) {
        return res.status(200).send({ msg: "Image updated", user: updatedUser });
      }
      throw new CustomError("User Not Found", 404);
  }
);

// FETCH ME CONTROLLER
export const fetchMeController = asyncMiddleware(
  async (req: CustomRequest, res: Response): Promise<Response> => {
      const {user} =req
      if(!user){
        throw new CustomError("Unauthorized", 401);
      }
      const me = await fetchMeService(user._id);
      
      if (!me) {
        throw new CustomError("User Not Found", 404);
      }
      return res.status(200).send( { user: me });

    }
);
