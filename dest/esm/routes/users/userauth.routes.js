import express from 'express';
import AuthController from '../../controller/users/userauth.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import multer from 'multer';
import { singleFileUpload } from '../../lib/fileUpload.utils';
const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({ storage: storage });
router.post('/register/:role', ValidationMiddleware.validate(ValidationMiddleware.schema.UserRegister), AuthController.userRegister);
router.post('/verify/otp/:type', ValidationMiddleware.validate(ValidationMiddleware.schema.VerifyOtp), AuthController.verifyOtp);
router.post('/resend/otp/:type', ValidationMiddleware.validate(ValidationMiddleware.schema.ResendOtp), AuthController.resendOtp);
router.post('/login/:role', ValidationMiddleware.validate(ValidationMiddleware.schema.UserLogin), AuthController.login);
router.get('/me', AuthGuard.verifyUserAccessToken, AuthController.me);
router.patch('/', AuthGuard.verifyUserAccessToken, upload.single('profile_picture'), singleFileUpload, ValidationMiddleware.validate(ValidationMiddleware.schema.UpdateProfile), AuthController.updateProfile);
router.patch('/change/password', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.ChangePassword), AuthController.changePassword);
router.post('/forgot/password', ValidationMiddleware.validate(ValidationMiddleware.schema.UserForgotPassword), AuthController.ForgotPassword);
router.post('/reset/password', AuthGuard.verifyUserAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.ResetPassword), AuthController.ResetPasswords);
router.delete('/', AuthGuard.verifyUserAccessToken, AuthController.deleteProfile);
router.post('/logout', AuthGuard.verifyUserAccessToken, AuthController.Logout);
export default router;
//# sourceMappingURL=userauth.routes.js.map