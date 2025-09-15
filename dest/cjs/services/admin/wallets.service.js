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
const constants_1 = require("../../lib/constants");
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const Utils = __importStar(require("../../lib/utils"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const helpFunctions_1 = require("../../lib/helpFunctions");
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
exports.default = new (class Miscervices {
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallets = yield wallet_model_1.default.findOne({ where: { user: userId } });
            return {
                message: constants_1.SuccessMsg.WALLETS.get,
                wallets: wallets,
            };
        });
    }
    addedToWallet(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWallets = yield wallet_model_1.default.findOne({ where: { user: userId }, raw: true });
            if (!userWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            const userBalance = (Number(userWallets.amount) + Number(args.amount)).toFixed(2);
            yield wallet_model_1.default.update({ amount: userBalance }, { where: { user: userId } });
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (user.fcm_token && user.role === 'customer') {
                yield (0, notifications_utils_1.sendCustomerNotification)(user, {
                    title: `PiuPiu Cash Credit`,
                    type: `addedWallet`,
                    body: `Here! your wallet account is credited with ${args.amount} by admin. for more details contact admin.`,
                    data: {},
                });
            }
            else if (user.fcm_token && user.role === 'driver') {
                yield (0, notifications_utils_1.sendDriverNotification)(user, {
                    title: `PiuPiu Cash Credit`,
                    type: `addedWallet`,
                    body: `Here! your wallet account is credited with ${args.amount} by admin. for more details contact admin.`,
                    data: {},
                });
            }
            const txRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            yield transaction_model_1.default.create({
                user: userId,
                amount: args.amount,
                currency: userWallets.currency,
                transactionType: 'credit',
                paymentMethod: 'wallet',
                purpose: 'PiuPiu Cash Credit',
                tx_ref: txRefId,
                status: 'success',
                type: 'wallet',
                method: 'wallet',
            });
            return {
                message: constants_1.SuccessMsg.WALLETS.Addition,
            };
        });
    }
    removedFromWAllet(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWallets = yield wallet_model_1.default.findOne({ where: { user: userId }, raw: true });
            if (!userWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            if (Number(args.amount) >= userWallets.amount) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.invalidAmount);
            }
            const userBalance = (Number(userWallets.amount) - Number(args.amount)).toFixed(2);
            yield wallet_model_1.default.update({ amount: userBalance }, { where: { user: userId } });
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (user.fcm_token && user.role === 'customer') {
                yield (0, notifications_utils_1.sendCustomerNotification)(user, {
                    title: `PiuPiu Cash Debit`,
                    type: `removeWallet`,
                    body: `Alert! your amount ${args.amount} is been debited by admin. for more details contact admin.`,
                    data: {},
                });
            }
            else if (user.fcm_token && user.role === 'driver') {
                yield (0, notifications_utils_1.sendDriverNotification)(user, {
                    title: `PiuPiu Cash Debit`,
                    type: `removeWallet`,
                    body: `Alert! your amount ${args.amount} is been debited by admin. for more details contact admin.`,
                    data: {},
                });
            }
            const txRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            yield transaction_model_1.default.create({
                user: userId,
                amount: args.amount,
                currency: userWallets.currency,
                transactionType: 'debit',
                paymentMethod: 'wallet',
                purpose: 'PiuPiu Cash Debit',
                tx_ref: txRefId,
                status: 'success',
                type: 'wallet',
                method: 'wallet',
            });
            return {
                message: constants_1.SuccessMsg.WALLETS.removed,
            };
        });
    }
    paymentHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield transaction_model_1.default.findAll({
                where: { method: 'flutterwave' },
                include: [
                    {
                        model: rides_model_1.default,
                        include: [
                            {
                                model: vehicleTypes_model_1.default,
                            },
                            {
                                model: vehicle_model_1.default,
                                attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                            },
                            {
                                model: users_model_1.default,
                                as: 'driver',
                                attributes: [
                                    'id',
                                    'name',
                                    'email',
                                    'profile_picture',
                                    'country_code',
                                    'phone_number',
                                ],
                            },
                            {
                                model: users_model_1.default,
                                as: 'passenger',
                                attributes: [
                                    'id',
                                    'name',
                                    'email',
                                    'profile_picture',
                                    'country_code',
                                    'phone_number',
                                ],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.PAYMENT.earningsHistory,
                transactions,
            };
        });
    }
})();
//# sourceMappingURL=wallets.service.js.map