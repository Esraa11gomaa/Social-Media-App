import joi from 'joi'
import { generalFields } from './../../middleware/validation.middlware.js';

export const signup = joi.object().keys({
    username:generalFields.username.required(),
    email: generalFields.email.required(),
    password: generalFields.password.required(),
    confirmationPassword:generalFields.confirmationPassword.valid(joi.ref("password")).required()
    
}).required()

export const login = joi.object().keys({
    email: generalFields.email.required(),
    password: generalFields.password.required()
}).required()

export const confirmEmail = joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required()
}).required()

export const validateForgetPsswordEmail = joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required()
}).required()

export const forgetPassword = joi.object().keys({
    email: generalFields.email.required()
})
export const resetPassword = joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required(),
    password: generalFields.password.required(),
    confirmationPassword: generalFields.confirmationPassword.valid(joi.ref('password')).required()
})

export const enableTwoStepVerification = joi.object().keys({
    email: generalFields.email.required()
})

export const validateTwoStepVerification = joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required()
}).required()

export const verifyTwoStepVerification = joi.object().keys({
    email: generalFields.email.required(),
    code: generalFields.code.required()
})