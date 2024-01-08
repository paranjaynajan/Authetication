import Joi from "joi";
interface I_body{
    newpassword: string;
    oldpassword: string;
}
export function validationChangePassword(body:I_body){
const validate=Joi.object({
    oldpassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).message('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long.'),
    newpassword: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).message('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long.'),
})
return validate.validate(body)
}