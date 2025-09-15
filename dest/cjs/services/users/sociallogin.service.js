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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../../models/users.model"));
const helpFunctions_1 = require("../../lib/helpFunctions");
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const JwtUtils = __importStar(require("../../lib/jwt.utils"));
const aws_config_1 = __importDefault(require("../../config/aws.config"));
const aws_utils_1 = require("../../lib/aws.utils");
// import { sendOTP } from '../lib/twilio.utils';
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const google_auth_library_1 = require("google-auth-library");
const google_config_1 = __importDefault(require("../../config/google.config"));
const referFriend_model_1 = __importDefault(require("../../models/referFriend.model"));
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const customerClient = new google_auth_library_1.OAuth2Client(google_config_1.default.customerClientId);
const driverClient = new google_auth_library_1.OAuth2Client(google_config_1.default.driverClientId);
exports.default = new (class SocialAuthService {
    customerGoogleRegister(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken } = args, requestData = __rest(args, ["accessToken"]);
            const ticket = yield customerClient.verifyIdToken({
                idToken: accessToken,
                audience: google_config_1.default.customerClientId,
            });
            if (!ticket) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            const payload = ticket.getPayload();
            if (payload.email !== requestData.email) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            const existUser = yield users_model_1.default.findOne({
                where: { country_code: requestData.country_code, phone_number: requestData.phone_number },
            });
            if (existUser) {
                if (requestData.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: requestData.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield users_model_1.default.findOne({
                where: { email: payload.email },
            });
            if (existEmail) {
                if (requestData.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: requestData.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.emailAlreadyExist);
            }
            if (args.referral_code) {
                const existReferral_code = yield users_model_1.default.findOne({
                    where: {
                        refer_friends_with: args.referral_code,
                        role: args.role,
                    },
                });
                if (!existReferral_code) {
                    if (args.profile_picture) {
                        yield (0, aws_utils_1.removeFilefromS3)({
                            Bucket: aws_config_1.default.s3BucketName,
                            Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                        });
                    }
                    Utils.throwError(constants_1.ErrorMsg.USER.incorrectReferalCode);
                }
            }
            console.log('args.region ----->>>', args.region);
            const uniqueUserId = yield (0, helpFunctions_1.generateUniqueID)(args.region);
            const referCode = (0, helpFunctions_1.generateReferCode)();
            const newUser = yield users_model_1.default.create(Object.assign({ user_id: uniqueUserId, refer_friends_with: referCode, register_with: 'social', social_register_with: 'google' }, requestData));
            let currency = 'NGN';
            if (args.currency) {
                currency = args.currency;
            }
            if (newUser.referral_code && newUser.role === 'customer') {
                const referralSection = yield referFriend_model_1.default.findOne({ type: 'customer' });
                const user = yield users_model_1.default.findOne({
                    where: { refer_friends_with: newUser.referral_code, role: 'customer' },
                });
                if (user) {
                    const amount = (referralSection === null || referralSection === void 0 ? void 0 : referralSection.walletAmount) || 0;
                    const existWallet = yield wallet_model_1.default.findOne({ where: { user: user.id } });
                    if (existWallet) {
                        const newAmount = (Number(existWallet.amount) + Number(referralSection === null || referralSection === void 0 ? void 0 : referralSection.walletAmount)).toFixed(2);
                        yield wallet_model_1.default.update({ amount: newAmount }, { where: { user: user.id } });
                    }
                    else {
                        yield wallet_model_1.default.create({
                            user: user.id,
                            amount: amount,
                            currency: currency,
                        });
                    }
                    if (user.fcmToken) {
                        yield (0, notifications_utils_1.sendCustomerNotification)(user, {
                            title: `You’ve Got a Reward!`,
                            type: `accountSetUp`,
                            body: `Congratulations! You’ve earned ${amount} NGN. Check your wallet now!`,
                            data: {},
                        });
                    }
                }
            }
            yield wallet_model_1.default.create({ user: newUser.id, amount: 0, currency: currency });
            // const otp = Utils.generateOTP();
            const otp = '1234';
            yield otp_model_1.default.create({ user: `${newUser.id}`, otp: otp, type: 'register' });
            return {
                message: constants_1.SuccessMsg.USER.register,
                otp: otp,
            };
        });
    }
    driverGoogleRegister(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken } = args, requestData = __rest(args, ["accessToken"]);
            const ticket = yield driverClient.verifyIdToken({
                idToken: accessToken,
                audience: google_config_1.default.driverClientId,
            });
            if (!ticket) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            const payload = ticket.getPayload();
            if (payload.email !== requestData.email) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            const existUser = yield users_model_1.default.findOne({
                where: { country_code: requestData.country_code, phone_number: requestData.phone_number },
            });
            if (existUser) {
                if (requestData.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: requestData.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield users_model_1.default.findOne({
                where: { email: payload.email },
            });
            if (existEmail) {
                if (requestData.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: requestData.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.emailAlreadyExist);
            }
            if (args.referral_code) {
                const existReferral_code = yield users_model_1.default.findOne({
                    where: {
                        refer_friends_with: args.referral_code,
                        role: args.role,
                    },
                });
                if (!existReferral_code) {
                    if (args.profile_picture) {
                        yield (0, aws_utils_1.removeFilefromS3)({
                            Bucket: aws_config_1.default.s3BucketName,
                            Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                        });
                    }
                    Utils.throwError(constants_1.ErrorMsg.USER.incorrectReferalCode);
                }
            }
            console.log('args.region ----->>>', args.region);
            const uniqueUserId = yield (0, helpFunctions_1.generateUniqueID)(args.region);
            const referCode = (0, helpFunctions_1.generateReferCode)();
            const newUser = yield users_model_1.default.create(Object.assign({ user_id: uniqueUserId, refer_friends_with: referCode, register_with: 'social', social_register_with: 'google' }, requestData));
            let currency = 'NGN';
            if (args.currency) {
                currency = args.currency;
            }
            if (newUser.referral_code && (newUser.role === 'customer' || newUser.role === 'driver')) {
                const referralSection = yield referFriend_model_1.default.findOne({ type: 'driver' });
                const user = yield users_model_1.default.findOne({
                    where: { refer_friends_with: newUser.referral_code, role: 'driver' },
                });
                if (user) {
                    const amount = (referralSection === null || referralSection === void 0 ? void 0 : referralSection.walletAmount) || 0;
                    const existWallet = yield wallet_model_1.default.findOne({ where: { user: user.id } });
                    if (existWallet) {
                        const newAmount = (Number(existWallet.amount) + Number(referralSection === null || referralSection === void 0 ? void 0 : referralSection.walletAmount)).toFixed(2);
                        yield wallet_model_1.default.update({ amount: newAmount }, { where: { user: user.id } });
                    }
                    else {
                        yield wallet_model_1.default.create({
                            user: user.id,
                            amount: amount,
                            currency: currency,
                        });
                    }
                    if (user.fcmToken && user.role === 'driver') {
                        yield (0, notifications_utils_1.sendDriverNotification)(user, {
                            title: `You’ve Got a Reward!`,
                            body: `Congratulations! You’ve earned ${amount} NGN. Check your wallet now!`,
                            data: {},
                            type: `accountSetUp`,
                        });
                    }
                }
            }
            yield wallet_model_1.default.create({ user: newUser.id, amount: 0, currency: currency });
            // const otp = Utils.generateOTP();
            const otp = '1234';
            yield otp_model_1.default.create({ user: `${newUser.id}`, otp: otp, type: 'register' });
            return {
                message: constants_1.SuccessMsg.USER.register,
                otp: otp,
            };
        });
    }
    FacebookRegister(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken } = args, requestData = __rest(args, ["accessToken"]);
            console.log(accessToken);
            const existUser = yield users_model_1.default.findOne({
                where: {
                    country_code: requestData.country_code,
                    phone_number: requestData.phone_number,
                },
            });
            if (existUser) {
                if (args.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield users_model_1.default.findOne({
                where: { email: requestData.email },
            });
            if (existEmail) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: existEmail.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                });
                Utils.throwError(constants_1.ErrorMsg.USER.emailAlreadyExist);
            }
            const uniqueUserId = yield (0, helpFunctions_1.generateUniqueID)(`IND`);
            const referCode = (0, helpFunctions_1.generateReferCode)();
            const newUser = yield users_model_1.default.create(Object.assign({ user_id: uniqueUserId, refer_friends_with: referCode, register_with: 'social', social_register_with: 'facebook' }, requestData));
            // const otp = Utils.generateOTP();
            const otp = '1234';
            yield otp_model_1.default.create({ user: `${newUser.id}`, otp: otp, type: 'register' });
            return {
                message: constants_1.SuccessMsg.USER.register,
                otp: otp,
            };
        });
    }
    customerGoogleLogin(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken } = args;
            const ticket = yield customerClient.verifyIdToken({
                idToken: accessToken,
                audience: google_config_1.default.customerClientId,
            });
            if (!ticket) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            const payload = ticket.getPayload();
            const user = yield users_model_1.default.findOne({
                where: { email: payload.email },
                raw: true,
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            if (!user.verify_account) {
                // const otp = Utils.generateOTP();
                const otp = '1234';
                yield otp_model_1.default.create({ user: `${user.id}`, otp: otp, type: 'login' });
                return {
                    message: constants_1.SuccessMsg.USER.sendOtp,
                    otp: otp,
                    user: user,
                };
            }
            else {
                const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, user), { type: 'user' }));
                return {
                    message: constants_1.SuccessMsg.USER.login,
                    user: user,
                    token: token,
                };
            }
        });
    }
    driverGoogleLogin(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { accessToken } = args;
            const ticket = yield driverClient.verifyIdToken({
                idToken: accessToken,
                audience: google_config_1.default.driverClientId,
            });
            if (!ticket) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            const payload = ticket.getPayload();
            const user = yield users_model_1.default.findOne({
                where: { email: payload.email },
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            if (!user.verify_account) {
                // const otp = Utils.generateOTP();
                const otp = '1234';
                yield otp_model_1.default.create({ user: `${user.id}`, otp: otp, type: 'login' });
                return {
                    message: constants_1.SuccessMsg.USER.sendOtp,
                    otp: otp,
                    user: user,
                };
            }
            else {
                const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, user), { type: 'user' }));
                return {
                    message: constants_1.SuccessMsg.USER.login,
                    user: user,
                    token: token,
                };
            }
        });
    }
    appleRegister(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield users_model_1.default.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (existUser) {
                if (args.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield users_model_1.default.findOne({
                where: { email: args.email },
            });
            if (existEmail) {
                if (args.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.emailAlreadyExist);
            }
            const existAppleId = yield users_model_1.default.findOne({
                where: { apple_id: args.apple_id },
            });
            if (existAppleId) {
                if (args.profile_picture) {
                    yield (0, aws_utils_1.removeFilefromS3)({
                        Bucket: aws_config_1.default.s3BucketName,
                        Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(constants_1.ErrorMsg.USER.appleIdAlreadyExist);
            }
            if (args.referral_code) {
                const existReferral_code = yield users_model_1.default.findOne({
                    where: {
                        refer_friends_with: args.referral_code,
                        role: args.role,
                    },
                });
                if (!existReferral_code) {
                    if (args.profile_picture) {
                        yield (0, aws_utils_1.removeFilefromS3)({
                            Bucket: aws_config_1.default.s3BucketName,
                            Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                        });
                    }
                    Utils.throwError(constants_1.ErrorMsg.USER.incorrectReferalCode);
                }
            }
            console.log('args.region ----->>>', args.region);
            const uniqueUserId = yield (0, helpFunctions_1.generateUniqueID)(args.region);
            const referCode = (0, helpFunctions_1.generateReferCode)();
            const newUser = yield users_model_1.default.create(Object.assign({ user_id: uniqueUserId, refer_friends_with: referCode, register_with: 'social', social_register_with: 'apple' }, args));
            let currency = 'NGN';
            if (args.currency) {
                currency = args.currency;
            }
            if (newUser.referral_code && (newUser.role === 'customer' || newUser.role === 'driver')) {
                const referralSection = yield referFriend_model_1.default.findOne({ type: 'driver' });
                const user = yield users_model_1.default.findOne({
                    where: { refer_friends_with: newUser.referral_code, role: 'driver' },
                });
                if (user) {
                    const amount = (referralSection === null || referralSection === void 0 ? void 0 : referralSection.walletAmount) || 0;
                    const existWallet = yield wallet_model_1.default.findOne({ where: { user: user.id } });
                    if (existWallet) {
                        const newAmount = (Number(existWallet.amount) + Number(referralSection === null || referralSection === void 0 ? void 0 : referralSection.walletAmount)).toFixed(2);
                        yield wallet_model_1.default.update({ amount: newAmount }, { where: { user: user.id } });
                    }
                    else {
                        yield wallet_model_1.default.create({
                            user: user.id,
                            amount: amount,
                            currency: currency,
                        });
                    }
                    if (user.fcmToken && user.role === 'driver') {
                        yield (0, notifications_utils_1.sendDriverNotification)(user, {
                            title: `You’ve Got a Reward!`,
                            body: `Congratulations! You’ve earned ${amount} NGN. Check your wallet now!`,
                            data: {},
                            type: `accountSetUp`,
                        });
                    }
                }
            }
            yield wallet_model_1.default.create({ user: newUser.id, amount: 0, currency: currency });
            // const otp = Utils.generateOTP();
            const otp = '1234';
            yield otp_model_1.default.create({ user: `${newUser.id}`, otp: otp, type: 'register' });
            return {
                message: constants_1.SuccessMsg.USER.register,
                otp: otp,
            };
        });
    }
    appleLogin(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { apple_id: args.apple_id, role: role } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            if (!user.verify_account) {
                // const otp = Utils.generateOTP();
                const otp = '1234';
                yield otp_model_1.default.create({ user: `${user.id}`, otp: otp, type: 'login' });
                return {
                    message: constants_1.SuccessMsg.USER.sendOtp,
                    otp: otp,
                    user: user,
                };
            }
            else {
                const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, user), { type: 'user' }));
                return {
                    message: constants_1.SuccessMsg.USER.login,
                    user: user,
                    token: token,
                };
            }
        });
    }
})();
//# sourceMappingURL=sociallogin.service.js.map