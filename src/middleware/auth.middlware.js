import { decodedToken } from '../utils/security/token.js';
import { AsyncHandeler } from './../utils/response/error.response.js';

export const authentication = ()=>{
    return AsyncHandeler(
        async(req, res, next)=>{
            const {authorization} = req.headers

            req.user = await decodedToken({authorization, next })
            return  next ()
        }
    )
}

export const autharization = ( accessRoles = [])=>{
    return AsyncHandeler(
        async(req, res, next)=>{
           if (! accessRoles.includes(req.user.role)) {
            return next (new Error(" Not Authorizes account ", {cause: 403}))
           }
            return  next ()
        }
    )
}