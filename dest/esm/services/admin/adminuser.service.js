var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdminUser from '../../models/admin.model';
import OTP from '../../models/otp.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import * as HashUtils from '../../lib/hash.utils';
import * as JwtUtils from '../../lib/jwt.utils';
export default new (class AdminUserService {
    login(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield AdminUser.findOne({ where: { email: args.email } });
            if (!adminUser) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            const hashCompareResult = yield HashUtils.compareHash(args.password, adminUser.password);
            if (!hashCompareResult) {
                Utils.throwError(ErrorMsg.USER.incorrectCredentials);
            }
            delete adminUser.password;
            const admin = yield AdminUser.findOne({ where: { email: args.email } });
            const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, admin.dataValues), { type: 'admin' }));
            return {
                message: SuccessMsg.USER.login,
                user: adminUser,
                token: token,
            };
        });
    }
    me(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield AdminUser.findOne({
                where: { id: args.userId },
                attributes: { exclude: ['password'] },
            });
            if (!adminUser) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            return {
                user: adminUser,
            };
        });
    }
    forgotPassword(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield AdminUser.findOne({
                where: { email: args.email },
                attributes: { exclude: ['password'] },
            });
            if (!adminUser) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            else {
                const otp = Utils.generateOTP();
                const userId = `${adminUser.id}`;
                yield OTP.destroy({ where: { user: userId } });
                yield OTP.create({ user: userId, type: 'forgot_password', otp: otp });
                const admin = yield AdminUser.findOne({ where: { email: args.email } });
                const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, admin.dataValues), { type: 'admin' }));
                return {
                    message: SuccessMsg.USER.sendOtp,
                    user: adminUser,
                    token: token,
                    otp: otp,
                };
            }
        });
    }
    verifyOtp(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield AdminUser.findOne({
                where: { id: userId },
                attributes: { exclude: ['password'] },
            });
            if (!adminUser) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            else {
                const otp = yield OTP.findOne({
                    where: {
                        user: userId,
                        type: 'forgot_password',
                        otp: args.otp,
                    },
                });
                if (!otp) {
                    Utils.throwError(ErrorMsg.USER.incorrectCredentials);
                }
                else {
                    yield OTP.destroy({ where: { user: userId } });
                    return {
                        message: SuccessMsg.USER.verifyOtp,
                        user: adminUser,
                    };
                }
            }
        });
    }
    resetPassword(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield AdminUser.findOne({ where: { id: userId } });
            if (!adminUser) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            else {
                //   const hashPassword: string = await generateHash(args.password);
                yield AdminUser.update({ password: args.password }, { where: { id: userId } });
                return {
                    message: SuccessMsg.USER.passwordUpdated,
                    user: adminUser,
                };
            }
        });
    }
})();
//# sourceMappingURL=adminuser.service.js.map