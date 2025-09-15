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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../../models/users.model"));
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const JwtUtils = __importStar(require("../../lib/jwt.utils"));
const HashUtils = __importStar(require("../../lib/hash.utils"));
const helpFunctions_1 = require("../../lib/helpFunctions");
const aws_config_1 = __importDefault(require("../../config/aws.config"));
const aws_utils_1 = require("../../lib/aws.utils");
const citymanagement_model_1 = __importDefault(require("../../models/citymanagement.model"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
// import ReferFriendsSection from '../../models/referFriend.model';
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
// import Transactions from '../../models/transaction.model';
// import { sendLoginOTP, sendRegisterOTP, sendMpinOTP } from '../../lib/twilio.utils';
const refferal_model_1 = __importDefault(require("../../models/refferal.model"));
exports.default = new (class UsersService {
    register(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield users_model_1.default.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
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
                where: {
                    email: args.email,
                },
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
            if (args.referral_code) {
                const existReferral_code = yield users_model_1.default.findOne({
                    where: {
                        refer_friends_with: args.referral_code,
                        role: role,
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
            const newUser = yield users_model_1.default.create(Object.assign({ user_id: uniqueUserId, refer_friends_with: referCode, role: role }, args));
            let currency = 'NGN';
            if (args.currency) {
                currency = args.currency;
            }
            if (newUser.referral_code && (newUser.role === 'customer' || newUser.role === 'driver')) {
                const user = yield users_model_1.default.findOne({
                    where: { refer_friends_with: newUser.referral_code },
                });
                if (user) {
                    yield refferal_model_1.default.create({
                        referrer_id: user.id,
                        referee_id: newUser.id,
                        referral_code: args.referral_code,
                        status: 'pending',
                        referrer_use_count: 0,
                        referee_use_count: 0,
                        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    });
                }
                if (user.fcm_token && user.role === 'driver') {
                    yield (0, notifications_utils_1.sendDriverNotification)(user, {
                        title: `You’ve Got a Reward!`,
                        body: `Congratulations! You’ve earned new refferal.`,
                        data: {},
                        type: `accountSetUp`,
                    });
                }
                if (user.fcm_token && user.role === 'customer') {
                    yield (0, notifications_utils_1.sendCustomerNotification)(user, {
                        title: `You’ve Got a Reward!`,
                        type: `accountSetUp`,
                        body: `Congratulations! You’ve earned new refferal.`,
                        data: {},
                    });
                }
            }
            const customerAmount = 0;
            yield wallet_model_1.default.create({ user: newUser.id, amount: customerAmount, currency: currency });
            const otp = Utils.generateOTP();
            // await sendRegisterOTP(newUser.phone_number, otp);
            yield otp_model_1.default.create({ user: `${newUser.id}`, otp: otp, type: 'register' });
            return {
                message: constants_1.SuccessMsg.USER.register,
                otp: otp,
            };
        });
    }
    resendOtp(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                },
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            yield otp_model_1.default.destroy({ where: { user: `${user.id}`, type: args.type } });
            const otp = Utils.generateOTP();
            // if (args.type === 'register') {
            //   await sendRegisterOTP(user.phone_number, otp);
            // } else if (args.type === 'login') {
            //   await sendLoginOTP(user.phone_number, otp);
            // } else if (args.type === 'forgot_mpin') {
            //   await sendMpinOTP(user.phone_number, otp);
            // }
            // await sendRegisterOTP(user.phone_number, otp);
            yield otp_model_1.default.create({ user: `${user.id}`, otp: otp, type: args.type });
            return {
                message: constants_1.SuccessMsg.USER.sendOtp,
                otp: otp,
            };
        });
    }
    verifyOtp(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            else {
                const otp = yield otp_model_1.default.findOne({
                    where: { user: `${user.id}`, type: type, otp: args.otp },
                });
                if (!otp) {
                    Utils.throwError(constants_1.ErrorMsg.USER.incorrectOtp);
                }
                else {
                    yield otp_model_1.default.destroy({ where: { user: `${user.id}`, type: type } });
                    if (type === 'register' || type === 'login') {
                        yield users_model_1.default.update({ verify_account: true }, { where: { id: `${user.id}` } });
                    }
                    const updatedUser = yield users_model_1.default.findOne({ where: { id: `${user.id}` } });
                    const token = yield JwtUtils.createToken({
                        userId: updatedUser.dataValues.id,
                        type: 'user',
                    });
                    return {
                        message: constants_1.SuccessMsg.USER.verifyOtp,
                        user: updatedUser,
                        token: token,
                    };
                }
            }
        });
    }
    login(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                    role: role,
                },
                raw: true,
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            console.log('user', user);
            if (user.status === 'inactive') {
                Utils.throwError(constants_1.ErrorMsg.USER.forbidden);
            }
            if (user.status === 'deleted') {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            const otp = Utils.generateOTP();
            // await sendLoginOTP(user.phone_number, otp);
            yield otp_model_1.default.create({ user: `${user.id}`, otp: otp, type: 'login' });
            if (args.fcm_token) {
                yield users_model_1.default.update({ fcm_token: args.fcm_token }, { where: { id: `${user.id}` } });
            }
            return {
                message: constants_1.SuccessMsg.USER.login,
                otp: otp,
            };
        });
    }
    me(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: { id: args.userId },
                attributes: { exclude: ['mpin'] },
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            return {
                message: constants_1.SuccessMsg.USER.profile,
                user: user,
            };
        });
    }
    changePassword(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            const checkPassword = yield HashUtils.compareHash(args.oldPassword, user.password);
            if (!checkPassword) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            if (args.oldPassword === args.newPassword) {
                Utils.throwError(constants_1.ErrorMsg.USER.samePassword);
            }
            const hashPassword = yield HashUtils.generateHash(args.newPassword);
            yield users_model_1.default.update({ password: hashPassword }, { where: { id: userId } });
            return {
                message: constants_1.SuccessMsg.USER.passwordUpdated,
                user: user,
            };
        });
    }
    updateProfile(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.updateCity) {
                const { country, state, city } = args;
                if (!country) {
                    Utils.throwError(constants_1.ErrorMsg.CITY.notFound);
                }
                let whereClause = { country };
                if (state) {
                    whereClause = Object.assign(Object.assign({}, whereClause), { state });
                }
                if (city) {
                    whereClause = Object.assign(Object.assign({}, whereClause), { city });
                }
                const cityExists = yield citymanagement_model_1.default.findOne({ where: whereClause });
                if (!cityExists) {
                    return {
                        message: constants_1.SuccessMsg.CITY.comingSoon,
                        cityExist: false,
                    };
                }
            }
            const oldUser = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!oldUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            yield users_model_1.default.update(args, { where: { id: userId } });
            const updatedUser = yield users_model_1.default.findOne({ where: { id: userId } });
            if (oldUser.profile_picture && oldUser.profile_picture !== updatedUser.profile_picture) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: oldUser.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                });
                if (args.profile_picture && oldUser.role === 'driver' && updatedUser.profile_picture) {
                    const vehicle = yield vehicle_model_1.default.findOne({ where: { user: userId } });
                    if (vehicle) {
                        const updatedDocuments = vehicle.documents.map((doc) => {
                            if (doc.name === 'profile_picture') {
                                return Object.assign(Object.assign({}, doc), { url: [updatedUser.profile_picture], 
                                    // eslint-disable-next-line @typescript-eslint/prefer-as-const
                                    status: 'pending', reason: null });
                            }
                            return doc;
                        });
                        yield vehicle.update({ documents: updatedDocuments, showCard: false });
                    }
                }
            }
            return {
                message: constants_1.SuccessMsg.USER.update,
                user: updatedUser,
            };
        });
    }
    forgotPassword(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: {
                    email: args.email,
                },
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            else {
                const otp = Utils.generateOTP();
                yield otp_model_1.default.destroy({ where: { user: user.id, type: 'forgot_password' } });
                yield otp_model_1.default.create({ user: user.id, type: 'forgot_password', otp: otp });
                return {
                    message: constants_1.SuccessMsg.USER.sendOtp,
                    otp: otp,
                };
            }
        });
    }
    ResetPassword(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            else {
                const hashPassword = yield HashUtils.generateHash(args.password);
                yield users_model_1.default.update({ password: hashPassword }, { where: { id: userId } });
                const updatedUser = yield users_model_1.default.findOne({ where: { id: `${user.id}` } });
                const token = yield JwtUtils.createToken({
                    userId: updatedUser.id,
                    type: 'user',
                });
                return {
                    message: constants_1.SuccessMsg.USER.passwordUpdated,
                    user: user,
                    token: token,
                };
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            yield users_model_1.default.update({ deleted_at: new Date(), status: 'deleted' }, { where: { id: userId } });
            if (user.profile_picture) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: user.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                });
            }
            // if (user.role === 'driver') {
            //   await deleteDriverRelatedData(user);
            // }
            return {
                message: constants_1.SuccessMsg.USER.delete,
            };
        });
    }
    Logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            yield users_model_1.default.update({ fcm_token: '' }, { where: { id: userId } });
            return {
                message: constants_1.SuccessMsg.USER.logout,
            };
        });
    }
})();
//# sourceMappingURL=userAuth.service.js.map