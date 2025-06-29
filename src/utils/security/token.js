import jwt from 'jsonwebtoken'
import userModel from '../../DB/model/User.model.js'
import * as dbService from '../../DB/dbService.js'

export const tokenTypes = {
    access:"access",
    refresh:"refresh"
}

export const decodedToken = async ({authorization = "" , tokenType = tokenTypes.access , next ={}} = {})=>{

    const [bearer, token] = authorization?.split(" ") || []
    if (!bearer || ! token) {
        return next(new Error(" Missing Token", {cause: 400}))
    }
    
    let access_signature = ''
    let refresh_signature = ''
    
    switch (bearer) {
        case 'System':
            access_signature = process.env.ADMIN_ACCESS_TOKEN
            refresh_signature = process.env.ADMIN_REFRESH_TOKEN
        break;
            
        case 'Bearer':
            access_signature = process.env.USER_ACCESS_TOKEN
            refresh_signature = process.env.USER_REFRESH_TOKEN
        break;
    
        default:
        break;
    }
    
    const decoded = verifyToken({token, signature: tokenType == tokenTypes.access ? access_signature : refresh_signature})
    
    if (!decoded?.id) {
        return next(new Error(" In-valid token payload", {cause: 401}))
    }
    
    const user = await dbService.findOne({
        model: userModel ,
        filter:{_id: decoded.id, isDeleted: false}
    }) 
    
    if (!user) {
        return next(new Error("Not register account ", {cause: 404}))
    }
    
    if (user.changeCridentialsTime?.getTime() >= decoded.iat * 1000) {
        return next(new Error("In-valid login Cridentials", {cause: 400}))
    }
    
    return user
}


export const generateToken = ({payload={} , signature=process.env.USER_ACCESS_TOKEN , expiresIn= process.env.EXPIRESIN})=>{

    const token = jwt.sign(payload , signature, {expiresIn: parseInt(expiresIn)})
    return token
}

export const verifyToken = ({ token , signature=process.env.USER_ACCESS_TOKEN})=>{

    const decoded = jwt.verify(token, signature)
    return decoded
}