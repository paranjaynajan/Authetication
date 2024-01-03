import Joi from "joi";
import { I_userUpdate } from "./validationUserUpdate.interface";

export function validationUserUpdate(userUpdate: I_userUpdate){
  const validation = Joi.object<I_userUpdate>({
    id:Joi.string().required(),
    lastname: Joi.string().min(3).max(30).required(),
    fathername: Joi.string().min(3).max(30).required(),
    address: Joi.object({
      city: Joi.string().min(5).required(),
      state: Joi.string().min(5).required(),
      pin: Joi.string().min(7).required(),
    }),
    age: Joi.string()
      .min(2)
      .max(3)
      .required()
      .regex(/^[1-9][0-9]$/),
    dob: Joi.date()
      .max(new Date().setFullYear(new Date().getFullYear() - 18))
      .required(),
    image: Joi.string().required(),
    
  });
  return validation.validate(userUpdate);
}
