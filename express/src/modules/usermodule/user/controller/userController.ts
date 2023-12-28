import { Request, Response } from "express";
import { asyncMiddleware } from "../../../../middlewares/asyncMiddleware";
import refreshTokenModel from "../../auth/models/refreshTokenModel";
import jwt from "jsonwebtoken"


export const updatePassword=(()=>{})

export const userSignOut = asyncMiddleware(
        async (req: Request, res: Response): Promise<Response> => {
          const value =req.cookies.refreshToken;
       
          if (!value) {
            return res.status(400).send({ msg: "invalid token" });
          }
          const token = req.cookies.refreshToken
          
          try {
            const payload = jwt.verify(token, `${process.env.REFRESHSECRETEKEY}`);
       
            if (typeof payload !== "object") {
       
              throw new Error();
            }
            const refreshTokenExistsDelete = await refreshTokenModel.deleteOne({
              userId: payload.id,
            });
           
            if (refreshTokenExistsDelete.deletedCount == 1) {
                res.clearCookie("refreshToken")
              return res.status(200).send({ msg: "Log out" });
            }
            return res.status(400).send({ msg: "Unauthorized" });
          } catch (err) {
            return res.status(400).send({ msg: err });
          }
        }
      );


 export const userMe=(()=>{})


  