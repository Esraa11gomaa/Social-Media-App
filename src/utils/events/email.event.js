import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { generateHash } from "../security/hash.security.js";
import userModel  from './../../DB/model/User.model.js';
import { sendEmail } from './../email/send.email.js';
import { verifyAccountTemplate } from "../email/template/verifyAccount.template.js";
import * as dbService from '../../DB/dbService.js'

export const emailEvent = new  EventEmitter()

export const emailSubject = {
    confirmEmail: "Confirma-Email",
    resetPassword: "Reset-Password",
    verifyTwoStepVerification:"Verify-Two-Step-Verification",
    updateEmail:"update-Email"

}

export const sendCode = async ({data ={}, subject= emailSubject.confirmEmail } = {}) =>{

    const { id, email}= data
    const otp = customAlphabet("0123456789", 6)()

    const hashOTP = generateHash({plainText:otp})

    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10)
    
    
    let updateData = {}

    switch (subject) {
        case emailSubject.confirmEmail:
            updateData = { 
                confirmEmailOtp: hashOTP, 
                confirmEmailOtpExpiry: otpExpiry
            }
            break;
        case emailSubject.resetPassword:
            updateData = {
                resetPasswordOtp: hashOTP,
                resetTokenExpiry:otpExpiry
                
            }
            break;
        case emailSubject.verifyTwoStepVerification:
            updateData = {
                verifyTwoStepVerificationOtp: hashOTP,
                verifyTwoStepVerificationExpire:otpExpiry
            }
            break;

        case emailSubject.updateEmail:
            updateData = {
                tempEmailOtp: hashOTP,
                tempEmailOtpExpire:otpExpiry
            }
            break;
        default:
            break;            
    }
    
    
    await dbService.updateOne({model:userModel, filter:{_id : id}, data: updateData})
    
    const html = verifyAccountTemplate({code:otp})

    await sendEmail({to:email, subject, html })
}


emailEvent.on("sendConfirmEmail", async (data)=>{
    await sendCode({data})
})

emailEvent.on("UpdateEmail", async (data)=>{
    console.log("📥 Received UpdateEmail event with data:", data);

    await sendCode({ data, subject: emailSubject.updateEmail });
    
})

emailEvent.on("forgetPassword", async(data)=>{

    await sendCode({data , subject:emailSubject.resetPassword} )
})
emailEvent.on("enableTwoStepVerification", async(data)=>{

    await sendCode({data , subject:emailSubject.verifyTwoStepVerification} )
})


