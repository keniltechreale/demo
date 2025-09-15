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
const sociallogin_service_1 = __importDefault(require("../../services/users/sociallogin.service"));
// import { IRequest } from '../../lib/common.interface';
exports.default = new (class AuthController {
    constructor() {
        this.customerGoogleRegister = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    email: body.email,
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    referral_code: body.referral_code,
                    role: 'customer',
                    profile_picture: body.profile_picture,
                    accessToken: body.accessToken,
                    region: body.region,
                    date_of_birth: body.date_of_birth,
                    currency: body.currency,
                };
                sociallogin_service_1.default.customerGoogleRegister(args)
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
        this.driverGoogleRegister = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    email: body.email,
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    referral_code: body.referral_code,
                    role: 'driver',
                    profile_picture: body.profile_picture,
                    accessToken: body.accessToken,
                    region: body.region,
                    date_of_birth: body.date_of_birth,
                    currency: body.currency,
                };
                sociallogin_service_1.default.driverGoogleRegister(args)
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
        this.facebookRegister = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    email: body.email,
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    referral_code: body.referral_code,
                    role: body.role,
                    profile_picture: body.profile_picture,
                    accessToken: body.accessToken,
                    region: body.region,
                    date_of_birth: body.date_of_birth,
                    currency: body.currency,
                };
                sociallogin_service_1.default.FacebookRegister(args)
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
        this.customerGoogleLogin = (req, res) => {
            try {
                const body = req.body;
                sociallogin_service_1.default.customerGoogleLogin(body)
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
        this.driverGoogleLogin = (req, res) => {
            try {
                const body = req.body;
                sociallogin_service_1.default.driverGoogleLogin(body)
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
        this.AppleRegister = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    first_name: body.first_name,
                    last_name: body.last_name,
                    email: body.email,
                    country_code: body.country_code,
                    phone_number: body.phone_number,
                    referral_code: body.referral_code,
                    role: req.params.role,
                    profile_picture: body.profile_picture,
                    accessToken: body.accessToken,
                    apple_id: body.apple_id,
                    region: body.region,
                    date_of_birth: body.date_of_birth,
                    currency: body.currency,
                };
                sociallogin_service_1.default.appleRegister(args)
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
        this.AppleLogin = (req, res) => {
            try {
                const body = req.body;
                const args = {
                    apple_id: body.apple_id,
                };
                sociallogin_service_1.default.appleLogin(args, req.params.role)
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
    }
})();
//# sourceMappingURL=sociallogin.controller.js.map