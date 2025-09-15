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
const Utils = __importStar(require("../../lib/utils"));
const userAuth_service_1 = __importDefault(require("../../services/users/userAuth.service"));
exports.default = new (class AuthController {
    constructor() {
        this.userRegister = (req, res) => {
            try {
                const body = req.body;
                userAuth_service_1.default.register(body, req.params.role)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.resendOtp = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    type: req.params.type,
                };
                userAuth_service_1.default.resendOtp(args)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.verifyOtp = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    otp: body.otp,
                };
                userAuth_service_1.default.verifyOtp(args, req.params.type)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.login = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    fcm_token: body.fcm_token,
                };
                userAuth_service_1.default.login(args, req.params.role)
                    .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                    .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.me = (req, res) => {
            const args = {
                userId: req.user.id,
            };
            userAuth_service_1.default.me(args)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.changePassword = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    oldPassword: body.oldPassword,
                    newPassword: body.newPassword,
                };
                userAuth_service_1.default.changePassword(args, req.user.id)
                    .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                    .catch((err) => res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
            }
            catch (err) {
                res
                    .status(Utils.getErrorStatusCode(err))
                    .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
            }
        };
        this.updateProfile = (req, res) => {
            const body = req.body;
            userAuth_service_1.default.updateProfile(body, req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.ForgotPassword = (req, res) => {
            const body = req.body;
            const args = {
                email: body.email,
            };
            userAuth_service_1.default.forgotPassword(args)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.ResetPasswords = (req, res) => {
            const body = req.body;
            const args = {
                password: body.password,
            };
            userAuth_service_1.default.ResetPassword(args, req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.deleteProfile = (req, res) => {
            userAuth_service_1.default.deleteUser(req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
        this.Logout = (req, res) => {
            userAuth_service_1.default.Logout(req.user.id)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) => res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))));
        };
    }
})();
//# sourceMappingURL=userauth.controller.js.map