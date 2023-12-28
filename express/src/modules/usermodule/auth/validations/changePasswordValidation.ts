import Joi from "joi"
import { I_changePassword } from "./changePassword.interface"

 

export const validationForUpdatePassword=(changePasswordBody:I_changePassword)=>{
    const validate=Joi.object({
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).message('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long.'),
        id:Joi.string().required(),
        token:Joi.string().required()
    })
return validate.validate(changePasswordBody)
}