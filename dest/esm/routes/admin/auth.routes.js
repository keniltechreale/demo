import express from 'express';
import AuthController from '../../controller/admin/auth.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Admin Authentication
 *   description: API endpoints for user authentication
 */
/**
 * @swagger
 * /api/v1/admin/auth/login:
 *   post:
 *     summary: Authenticate a user.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: "xyx@gmail.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *                 example: "1234"
 *     responses:
 *       '200':
 *         description: Successful login.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "65a0e1654d942eda4a4d1f52"
 *                   name: "admin"
 *                   email: "admin@goparcel.com"
 *                   createdAt: "2024-01-12T06:51:17.985Z"
 *                   updatedAt: "2024-01-12T06:51:17.985Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
 *       '422':
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "email is required. password is required"
 *       '400':
 *         description: User not found or incorrect credentials.
 *         content:
 *           application/json:
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   status: error
 *                   message: "User not found"
 *               IncorrectCredentials:
 *                 value:
 *                   status: error
 *                   message: "Incorrect credentials"
 */
router.post('/login', ValidationMiddleware.validate(ValidationMiddleware.schema.AdminLogin), AuthController.login);
/**
 * @swagger
 * /api/v1/admin/auth/me:
 *   get:
 *     summary: Get current user details.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "65a0e1654d942eda4a4d1f52"
 *                   name: "admin"
 *                   email: "admin@goparcel.com"
 *                   createdAt: "2024-01-12T06:51:17.985Z"
 *                   updatedAt: "2024-01-12T06:51:17.985Z"
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 */
router.get('/me', AuthGuard.verifyAdminAccessToken, AuthController.me);
/**
 * @swagger
 * /api/v1/admin/auth/forgot/password:
 *   post:
 *     summary: Send password reset email.
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *                 example: "xyx@gmail.com"
 *     responses:
 *       '200':
 *         description: Successful.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "65a0e1654d942eda4a4d1f52"
 *                   name: "admin"
 *                   email: "admin@goparcel.com"
 *                   createdAt: "2024-01-12T06:51:17.985Z"
 *                   updatedAt: "2024-01-12T06:51:17.985Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
 *                 otp: "4152"
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 *       '422':
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "email is required"
 *       '400':
 *         description: User not found or incorrect credentials.
 *         content:
 *           application/json:
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   status: error
 *                   message: "User not found"
 *               IncorrectCredentials:
 *                 value:
 *                   status: error
 *                   message: "Incorrect credentials"
 */
router.post('/forgot/password', ValidationMiddleware.validate(ValidationMiddleware.schema.ForgotPassword), AuthController.forgotPassword);
/**
 * @swagger
 * /api/v1/admin/auth/reset/password:
 *   post:
 *     summary: Reset user password.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "newPassword123"
 *     responses:
 *       '200':
 *         description: Successful.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "65a0e1654d942eda4a4d1f52"
 *                   name: "admin"
 *                   email: "admin@goparcel.com"
 *                   createdAt: "2024-01-12T06:51:17.985Z"
 *                   updatedAt: "2024-01-12T06:51:17.985Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 *       '422':
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "password are required"
 *       '400':
 *         description: User not found or incorrect credentials.
 *         content:
 *           application/json:
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   status: error
 *                   message: "User not found"
 *               IncorrectCredentials:
 *                 value:
 *                   status: error
 *                   message: "Incorrect credentials"
 */
router.post('/reset/password', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.ResetPassword), AuthController.resetPassword);
/**
 * @swagger
 * /api/v1/admin/auth/verify/otp:
 *   post:
 *     summary: Verify OTP for password reset.
 *     tags: [Admin Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP received for verification.
 *                 example: "4152"
 *     responses:
 *       '200':
 *         description: Successful.
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               data:
 *                 user:
 *                   _id: "65a0e1654d942eda4a4d1f52"
 *                   name: "admin"
 *                   email: "admin@goparcel.com"
 *                   createdAt: "2024-01-12T06:51:17.985Z"
 *                   updatedAt: "2024-01-12T06:51:17.985Z"
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
 *       '401':
 *         description: Unauthorized access. Missing or invalid Bearer token.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "Unauthorized access"
 *       '422':
 *         description: Validation error.
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: "email and otp are required"
 *       '400':
 *         description: User not found or incorrect credentials.
 *         content:
 *           application/json:
 *             examples:
 *               UserNotFound:
 *                 value:
 *                   status: error
 *                   message: "User not found"
 *               IncorrectCredentials:
 *                 value:
 *                   status: error
 *                   message: "Incorrect credentials"
 */
router.post('/verify/otp', AuthGuard.verifyAdminAccessToken, ValidationMiddleware.validate(ValidationMiddleware.schema.AdminVerifyOtp), AuthController.verifyOtp);
export default router;
//# sourceMappingURL=auth.routes.js.map