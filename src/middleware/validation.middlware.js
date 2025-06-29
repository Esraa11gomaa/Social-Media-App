import joi from 'joi'
import { Types } from 'mongoose';

export const isValidObjectId = (value, helper)=>{
    return Types.ObjectId.isValid(value) ? true : helper.message("In-valid object id")
}

export const generalFields = {
    username: joi.string().min(2).max(50).trim(),
    email: joi.string().email({minDomainSegments:2 , maxDomainSegments:3, tlds:{allow:['com', 'net', 'outlook']}}),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[#&<>@\"~;$^%{}?])(?=.*[a-zA-Z]).{8,}$/)),
    confirmationPassword:joi.string(),
    code:joi.string().pattern(new RegExp(/^\d{6}$/)),
    id: joi.string().custom(isValidObjectId)
}
export const validation = (Schema)=>{
return (req, res , next)=>{
    const inputs ={...req.query, ...req.body, ...req.params }

    const validationResult = Schema.validate(inputs ,{ abortEarly: false })

    if (validationResult.error) {
        return res.status(400).json({message:"validation error" , details: validationResult.error.details})
    }

    return next()
}
}