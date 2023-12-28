import Joi from 'joi'

const refreshTokenValidation = (refreshToken:object) =>{
    const refreshTokenValidation = Joi.object({
        refreshToken: Joi.string().required(),
        userId: Joi.string().required(),    
        role: Joi.string().required(),
    })

    return refreshTokenValidation.validate(refreshToken)
}

export default refreshTokenValidation