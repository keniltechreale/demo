var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Users from '../../models/users.model';
import OTP from '../../models/otp.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import * as JwtUtils from '../../lib/jwt.utils';
import * as HashUtils from '../../lib/hash.utils';
import { generateReferCode, generateUniqueID } from '../../lib/helpFunctions';
import AWSUtils from '../../config/aws.config';
import { removeFilefromS3 } from '../../lib/aws.utils';
import CityManagement from '../../models/citymanagement.model';
import Vehicle from '../../models/vehicle.model';
// import ReferFriendsSection from '../../models/referFriend.model';
import Wallets from '../../models/wallet.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
// import Transactions from '../../models/transaction.model';
// import { sendLoginOTP, sendRegisterOTP, sendMpinOTP } from '../../lib/twilio.utils';
import Referrals from '../../models/refferal.model';
export default new (class UsersService {
    register(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield Users.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                },
            });
            if (existUser) {
                if (args.profile_picture) {
                    yield removeFilefromS3({
                        Bucket: AWSUtils.s3BucketName,
                        Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield Users.findOne({
                where: {
                    email: args.email,
                },
            });
            if (existEmail) {
                if (args.profile_picture) {
                    yield removeFilefromS3({
                        Bucket: AWSUtils.s3BucketName,
                        Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                    });
                }
                Utils.throwError(ErrorMsg.USER.emailAlreadyExist);
            }
            if (args.referral_code) {
                const existReferral_code = yield Users.findOne({
                    where: {
                        refer_friends_with: args.referral_code,
                        role: role,
                    },
                });
                if (!existReferral_code) {
                    if (args.profile_picture) {
                        yield removeFilefromS3({
                            Bucket: AWSUtils.s3BucketName,
                            Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                        });
                    }
                    Utils.throwError(ErrorMsg.USER.incorrectReferalCode);
                }
            }
            console.log('args.region ----->>>', args.region);
            const uniqueUserId = yield generateUniqueID(args.region);
            const referCode = generateReferCode();
            const newUser = yield Users.create(Object.assign({ user_id: uniqueUserId, refer_friends_with: referCode, role: role }, args));
            let currency = 'NGN';
            if (args.currency) {
                currency = args.currency;
            }
            if (newUser.referral_code && (newUser.role === 'customer' || newUser.role === 'driver')) {
                const user = yield Users.findOne({
                    where: { refer_friends_with: newUser.referral_code },
                });
                if (user) {
                    yield Referrals.create({
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
                    yield sendDriverNotification(user, {
                        title: `You’ve Got a Reward!`,
                        body: `Congratulations! You’ve earned new refferal.`,
                        data: {},
                        type: `accountSetUp`,
                    });
                }
                if (user.fcm_token && user.role === 'customer') {
                    yield sendCustomerNotification(user, {
                        title: `You’ve Got a Reward!`,
                        type: `accountSetUp`,
                        body: `Congratulations! You’ve earned new refferal.`,
                        data: {},
                    });
                }
            }
            const customerAmount = 0;
            yield Wallets.create({ user: newUser.id, amount: customerAmount, currency: currency });
            const otp = Utils.generateOTP();
            // await sendRegisterOTP(newUser.phone_number, otp);
            yield OTP.create({ user: `${newUser.id}`, otp: otp, type: 'register' });
            return {
                message: SuccessMsg.USER.register,
                otp: otp,
            };
        });
    }
    resendOtp(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                },
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            yield OTP.destroy({ where: { user: `${user.id}`, type: args.type } });
            const otp = Utils.generateOTP();
            // if (args.type === 'register') {
            //   await sendRegisterOTP(user.phone_number, otp);
            // } else if (args.type === 'login') {
            //   await sendLoginOTP(user.phone_number, otp);
            // } else if (args.type === 'forgot_mpin') {
            //   await sendMpinOTP(user.phone_number, otp);
            // }
            // await sendRegisterOTP(user.phone_number, otp);
            yield OTP.create({ user: `${user.id}`, otp: otp, type: args.type });
            return {
                message: SuccessMsg.USER.sendOtp,
                otp: otp,
            };
        });
    }
    verifyOtp(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            else {
                const otp = yield OTP.findOne({
                    where: { user: `${user.id}`, type: type, otp: args.otp },
                });
                if (!otp) {
                    Utils.throwError(ErrorMsg.USER.incorrectOtp);
                }
                else {
                    yield OTP.destroy({ where: { user: `${user.id}`, type: type } });
                    if (type === 'register' || type === 'login') {
                        yield Users.update({ verify_account: true }, { where: { id: `${user.id}` } });
                    }
                    const updatedUser = yield Users.findOne({ where: { id: `${user.id}` } });
                    const token = yield JwtUtils.createToken({
                        userId: updatedUser.dataValues.id,
                        type: 'user',
                    });
                    return {
                        message: SuccessMsg.USER.verifyOtp,
                        user: updatedUser,
                        token: token,
                    };
                }
            }
        });
    }
    login(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                    role: role,
                },
                raw: true,
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            console.log('user', user);
            if (user.status === 'inactive') {
                Utils.throwError(ErrorMsg.USER.forbidden);
            }
            if (user.status === 'deleted') {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            const otp = Utils.generateOTP();
            // await sendLoginOTP(user.phone_number, otp);
            yield OTP.create({ user: `${user.id}`, otp: otp, type: 'login' });
            if (args.fcm_token) {
                yield Users.update({ fcm_token: args.fcm_token }, { where: { id: `${user.id}` } });
            }
            return {
                message: SuccessMsg.USER.login,
                otp: otp,
            };
        });
    }
    me(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: { id: args.userId },
                attributes: { exclude: ['mpin'] },
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            return {
                message: SuccessMsg.USER.profile,
                user: user,
            };
        });
    }
    changePassword(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            const checkPassword = yield HashUtils.compareHash(args.oldPassword, user.password);
            if (!checkPassword) {
                Utils.throwError(ErrorMsg.USER.incorrectCredentials);
            }
            if (args.oldPassword === args.newPassword) {
                Utils.throwError(ErrorMsg.USER.samePassword);
            }
            const hashPassword = yield HashUtils.generateHash(args.newPassword);
            yield Users.update({ password: hashPassword }, { where: { id: userId } });
            return {
                message: SuccessMsg.USER.passwordUpdated,
                user: user,
            };
        });
    }
    updateProfile(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args.updateCity) {
                const { country, state, city } = args;
                if (!country) {
                    Utils.throwError(ErrorMsg.CITY.notFound);
                }
                let whereClause = { country };
                if (state) {
                    whereClause = Object.assign(Object.assign({}, whereClause), { state });
                }
                if (city) {
                    whereClause = Object.assign(Object.assign({}, whereClause), { city });
                }
                const cityExists = yield CityManagement.findOne({ where: whereClause });
                if (!cityExists) {
                    return {
                        message: SuccessMsg.CITY.comingSoon,
                        cityExist: false,
                    };
                }
            }
            const oldUser = yield Users.findOne({ where: { id: userId } });
            if (!oldUser) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            yield Users.update(args, { where: { id: userId } });
            const updatedUser = yield Users.findOne({ where: { id: userId } });
            if (oldUser.profile_picture && oldUser.profile_picture !== updatedUser.profile_picture) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldUser.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                });
                if (args.profile_picture && oldUser.role === 'driver' && updatedUser.profile_picture) {
                    const vehicle = yield Vehicle.findOne({ where: { user: userId } });
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
                message: SuccessMsg.USER.update,
                user: updatedUser,
            };
        });
    }
    forgotPassword(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: {
                    email: args.email,
                },
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            else {
                const otp = Utils.generateOTP();
                yield OTP.destroy({ where: { user: user.id, type: 'forgot_password' } });
                yield OTP.create({ user: user.id, type: 'forgot_password', otp: otp });
                return {
                    message: SuccessMsg.USER.sendOtp,
                    otp: otp,
                };
            }
        });
    }
    ResetPassword(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            else {
                const hashPassword = yield HashUtils.generateHash(args.password);
                yield Users.update({ password: hashPassword }, { where: { id: userId } });
                const updatedUser = yield Users.findOne({ where: { id: `${user.id}` } });
                const token = yield JwtUtils.createToken({
                    userId: updatedUser.id,
                    type: 'user',
                });
                return {
                    message: SuccessMsg.USER.passwordUpdated,
                    user: user,
                    token: token,
                };
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            yield Users.update({ deleted_at: new Date(), status: 'deleted' }, { where: { id: userId } });
            if (user.profile_picture) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: user.profile_picture.replace('/profile_picture/', 'profile_picture/'),
                });
            }
            // if (user.role === 'driver') {
            //   await deleteDriverRelatedData(user);
            // }
            return {
                message: SuccessMsg.USER.delete,
            };
        });
    }
    Logout(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            yield Users.update({ fcm_token: '' }, { where: { id: userId } });
            return {
                message: SuccessMsg.USER.logout,
            };
        });
    }
})();
//# sourceMappingURL=userAuth.service.js.map