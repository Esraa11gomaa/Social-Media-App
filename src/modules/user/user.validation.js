import joi from 'joi'
import { generalFields } from './../../middleware/validation.middlware.js';

export const shareProfile = joi.object().keys(
   { 
    profileId:generalFields.id.required()

   }
).required()

export const updateEmail = joi.object().keys(
   { 
   email:generalFields.email.required()

   }
).required()

export const resetEmail = joi.object().keys(
   { 
   email:generalFields.email.required(),
   code:generalFields.code.required()

   }
).required()

export const updatePassword = joi.object().keys({

   username:generalFields.username,
   DOB:generalFields.DOB,
   

}).required()
