import { Router } from 'express'
import * as registrationService from './service/registration.service.js';
import * as loginService from './service/login.service.js'
import * as validators from './auth.validation.js'
import { validation } from './../../middleware/validation.middlware.js';

const router = Router();


router.post("/signup", validation(validators.signup),registrationService.signup)

router.patch("/confirm-email", validation(validators.confirmEmail),registrationService.confirmEmail)

router.post("/login", validation(validators.login),loginService.login)

router.post("/loginWithGmail",loginService.loginWithGmail)

router.get("/refresh-token",loginService.refreshToken)

router.patch("/forget-password", validation(validators.forgetPassword),loginService.forgetPassword)

router.patch("/validate-forget-password", validation(validators.validateForgetPsswordEmail),loginService.validateForgetPassword )

router.patch("/reset-password", validation(validators.resetPassword),loginService.resetPassword )

router.patch("/enable-2fa",validation(validators.enableTwoStepVerification),loginService.enableTwoStepVerification
)

router.patch("/validate-2fa",validation(validators.validateTwoStepVerification),loginService.validateTwoStepVerification
)

router.patch("/verify-2fa",validation(validators.verifyTwoStepVerification),loginService.verifyTwoStepVerification
)

export default router