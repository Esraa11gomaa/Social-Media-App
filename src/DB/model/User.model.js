import mongoose, { Schema, model , Types } from "mongoose"

export const genderTypes = {
    male:'male',
    female: 'female'
}
export const rolesTypes = {
    user:'user',
    admin:'admin'
}

export const providerTypes = {
    google:"google",
    System:"system"
}
const userSchema = new Schema({

    username:{
        type:String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
  
    confirmEmailOtp: String,
    confirmEmailOtpExpiry: {  
        type: Date
    },
    tempEmail: String,
    tempEmailOtp:String,
    tempEmailExpire:Date,
    password:{
        type: String,
        required: (data)=>{
            return data?.provider === providerTypes.google ? false : true
        }
    },
    resetPassword: String, 
    resetPasswordOtp: String,
    resetTokenExpiry:{
        type:  Date
    },
    verifyTwoStepVerification: String,
    verifyTwoStepVerificationOtp: String,
    verifyTwoStepVerificationExpire:{
        type: Date
    },
    phone:String,
    address:String,
    DOB:Date,
    image: String,
    coverImages:[String],
    gender:{
        type:String,
        enum:Object.values(genderTypes),
        default: genderTypes.male
    },
    roles:{
        type:String,
        enum:Object.values(rolesTypes),
        default: rolesTypes.user
    },
    confirmEmail:{
        type: Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    changeCridentialsTime: Date,
    provider:{
        type:String,
        enum:Object.values(providerTypes),
        default: providerTypes.System
    },
    viewers:[
        {
            userId:{
                type: Types.ObjectId,
                ref: 'User'
            },
            time: Date
        }
    ]
},{timestamps: true})


const userModel = mongoose.model.User || model(`User`, userSchema)

export default userModel
