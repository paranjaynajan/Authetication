import Joi from 'joi';
import { I_user } from './userValidation.interface';

export function validationForSign_Up(userSignup: object) {
    const validation = Joi.object<I_user>({
        name: Joi.string().min(3).max(30).required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).message('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and be at least 8 characters long.'),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).required().max(10),
        image: Joi.string().default(null),
        role: Joi.string().default("user")
    })
    return validation.validate(userSignup)
}


export function validationForSign_In(userLogin: { email?: string, password: string, phone?: string }) {

    const validate = Joi.object({
        ...(userLogin.email ? { email: Joi.string().email().required() } : { phone: Joi.string().min(10).required().max(10) }),
        password: Joi.string().required
        ().min(8)
    })
    const result = validate.validate(userLogin)

    if (!userLogin.email && !userLogin.phone && result.error) {
        result.error.details[0].message = 'email or phone is required'
    }
    return result
}

export function validationForRestPassword(restPasswordBody: { phone?: string, email?: string }) {
    const val=restPasswordBody.email ? { email: Joi.string().email().required() } 
    : { phone : Joi.string().min(10).required().max(10) }
    const validate = Joi.object({
        ...val
    })
    const result = validate.validate(restPasswordBody)

    if (!restPasswordBody.email && !restPasswordBody.phone && result.error) {
        result.error.details[0].message = 'email or phone is required'
    }
    return result
}
