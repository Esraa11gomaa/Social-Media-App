import { AsyncHandeler } from "../../../utils/response/error.response.js";
import { successResponse } from './../../../utils/response/success.response.js';
import * as dbService from '../../../DB/dbService.js'
import userModel from "../../../DB/model/User.model.js";
import { emailEvent } from './../../../utils/events/email.event.js';
import { compareHash, generateHash } from "../../../utils/security/hash.security.js";


export const profile = AsyncHandeler(async(req, res , next)=>{

    const user = await dbService.findOne({model: userModel,
        filter:{_id: req.user._id},
        populate:[{
            path:"viewers.userId",
            select: "username image"
        }]
    })
    return successResponse({res, data:{user}})
})

export const shareProfile = AsyncHandeler(
    async (req, res, next) => {
        const {profileId} = req.params

        let user = null

        if (profileId === req.user._id.toString()) {
            
            user = req.user
        }else{
            user = await dbService.findOneAndUpdate({model: userModel,
                filter:{
                    _id: profileId , isDeleted: false
                },
                data:{
                 $push: {
                    viewers:{
                        userId: req.user._id,
                        time: Date.now()
                    }
                 } 
                },
                select:' username image email'
            })
        }


        return user ? successResponse({res, data:{user}}) : next (new Error("In-valid account", {cause: 404}))
    }
)

export const updateProfile = AsyncHandeler(
    async (req, res, next) => {
        
        return successResponse(res)
    }
)

export const updateEmail = AsyncHandeler(
    async (req, res, next) => {
      const {email } = req.body
      
      if(await dbService.findOne({model:userModel, filter:{email}})){
        return next(new Error("Email exist", {cause: 409}))
      }
      
      await dbService.updateOne({model: userModel, filter:{ _id: req.user._id}, data:{tempEmail:email}})

      emailEvent.emit("UpdateEmail", {id: req.user._id, email})
      return successResponse({ res, message: "OTP sent to your email" });
    }
)

export const resetEmail = AsyncHandeler(
    async(req, res, next)=>{

        const {email ,code} = req.body

        const user = await dbService.findOne({
            model: userModel,
            filter:{
                email, isDeleted: false
            }
        }) 

        if(!user){
            return next(new Error("In-valid account", {cause: 404}))
        }

        if(!user.confirmEmail){
            return next(new Error("verify your account first", {cause: 400}))
        }

        if( new Date() > user.tempEmailExpire){
            return next(new Error("Code expired", {cause:400}))
        }

        if (!compareHash({plainText:code , hashValue:user.tempEmailOtp})) {
            return next(new Error ("In-valid reset code", {cause: 400}))
        }

        await dbService.updateOne({
            model:userModel,
            filter:{email},
            data:{
                changeCridentialsTime: Date.now() ,$unset:{tempEmailOtp: 0,tempEmailOtpExpire: 0}
            }
        })
        return successResponse({ res, message: "Email reset successfully" });
    }
)

export const updatePassword = AsyncHandeler(
    async(req, res, next)=>{

        const {oldPassword, Password} = req.body

        if (!compareHash({plainText: oldPassword, hashValue: req.user.password})) {
            
            return next(new Error("In-valid old password", {cause:400}))
        }
        await dbService.updateOne({
            model: userModel,
            filter:{_id:req.user._id},
            data:{
                password: generateHash({plainText: Password}),
                changeCridentialsTime:Date.now(),
               
            }
        })
       
        
        return successResponse({ res, data:{}});
    }
)

