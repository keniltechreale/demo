"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../../controller/admin/auth.controller"));
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const AuthGuard = __importStar(require("../../middleware/authGard"));
const router = express_1.default.Router();
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
router.post('/login', validation_middleware_1.default.validate(validation_middleware_1.default.schema.AdminLogin), auth_controller_1.default.login);
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
router.get('/me', AuthGuard.verifyAdminAccessToken, auth_controller_1.default.me);
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
router.post('/forgot/password', validation_middleware_1.default.validate(validation_middleware_1.default.schema.ForgotPassword), auth_controller_1.default.forgotPassword);
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
router.post('/reset/password', AuthGuard.verifyAdminAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.ResetPassword), auth_controller_1.default.resetPassword);
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
router.post('/verify/otp', AuthGuard.verifyAdminAccessToken, validation_middleware_1.default.validate(validation_middleware_1.default.schema.AdminVerifyOtp), auth_controller_1.default.verifyOtp);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map