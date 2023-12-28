import Joi from "joi"

export const validationForOtp=(otpBody:{otp:string,id:string})=>{
    const validate=Joi.object({
        otp:Joi.string().required(),
        id:Joi.string().required()
    })
    return validate.validate(otpBody)
}
