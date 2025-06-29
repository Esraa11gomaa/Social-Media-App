import { Router } from "express";
import { authentication } from './../../middleware/auth.middlware.js';
import * as userService from './service/user.service.js'
import * as validators from './user.validation.js'
import { validation } from "../../middleware/validation.middlware.js";
const router = Router()

router.get("/profile", authentication(), userService.profile
)

router.get("/profile/:profileId", validation(validators.shareProfile) ,authentication(), userService.shareProfile
)

router.patch("/profile", validation(validators.updateProfile), authentication() ,userService.updateProfile
)

router.patch("/profile/email", validation(validators.updateEmail) ,authentication(), userService.updateEmail
)

router.patch("/profile/reset-email", validation(validators.resetEmail), userService.resetEmail
)

router.patch("/profile/password", validation(validators.updatePassword), authentication() ,userService.updatePassword
)


export default router