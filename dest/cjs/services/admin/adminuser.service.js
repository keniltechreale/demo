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
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const HashUtils = __importStar(require("../../lib/hash.utils"));
const JwtUtils = __importStar(require("../../lib/jwt.utils"));
exports.default = new (class AdminUserService {
    login(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_model_1.default.findOne({ where: { email: args.email } });
            if (!adminUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            const hashCompareResult = yield HashUtils.compareHash(args.password, adminUser.password);
            if (!hashCompareResult) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
            }
            delete adminUser.password;
            const admin = yield admin_model_1.default.findOne({ where: { email: args.email } });
            const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, admin.dataValues), { type: 'admin' }));
            return {
                message: constants_1.SuccessMsg.USER.login,
                user: adminUser,
                token: token,
            };
        });
    }
    me(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_model_1.default.findOne({
                where: { id: args.userId },
                attributes: { exclude: ['password'] },
            });
            if (!adminUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            return {
                user: adminUser,
            };
        });
    }
    forgotPassword(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_model_1.default.findOne({
                where: { email: args.email },
                attributes: { exclude: ['password'] },
            });
            if (!adminUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            else {
                const otp = Utils.generateOTP();
                const userId = `${adminUser.id}`;
                yield otp_model_1.default.destroy({ where: { user: userId } });
                yield otp_model_1.default.create({ user: userId, type: 'forgot_password', otp: otp });
                const admin = yield admin_model_1.default.findOne({ where: { email: args.email } });
                const token = yield JwtUtils.createToken(Object.assign(Object.assign({}, admin.dataValues), { type: 'admin' }));
                return {
                    message: constants_1.SuccessMsg.USER.sendOtp,
                    user: adminUser,
                    token: token,
                    otp: otp,
                };
            }
        });
    }
    verifyOtp(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_model_1.default.findOne({
                where: { id: userId },
                attributes: { exclude: ['password'] },
            });
            if (!adminUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            else {
                const otp = yield otp_model_1.default.findOne({
                    where: {
                        user: userId,
                        type: 'forgot_password',
                        otp: args.otp,
                    },
                });
                if (!otp) {
                    Utils.throwError(constants_1.ErrorMsg.USER.incorrectCredentials);
                }
                else {
                    yield otp_model_1.default.destroy({ where: { user: userId } });
                    return {
                        message: constants_1.SuccessMsg.USER.verifyOtp,
                        user: adminUser,
                    };
                }
            }
        });
    }
    resetPassword(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminUser = yield admin_model_1.default.findOne({ where: { id: userId } });
            if (!adminUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            else {
                //   const hashPassword: string = await generateHash(args.password);
                yield admin_model_1.default.update({ password: args.password }, { where: { id: userId } });
                return {
                    message: constants_1.SuccessMsg.USER.passwordUpdated,
                    user: adminUser,
                };
            }
        });
    }
})();
//# sourceMappingURL=adminuser.service.js.map