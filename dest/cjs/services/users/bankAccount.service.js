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
const bankAccount_model_1 = __importDefault(require("../../models/bankAccount.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const cashoutRequest_model_1 = __importDefault(require("../../models/cashoutRequest.model"));
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const helpFunctions_1 = require("../../lib/helpFunctions");
exports.default = new (class BankAccountservice {
    addBankAccounts(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role !== 'driver') {
                Utils.throwError(constants_1.ErrorMsg.BANKACCOUNTS.invalidUser);
            }
            const existBankAccount = yield bankAccount_model_1.default.findOne({
                where: { user: user.id },
                raw: true,
            });
            if (existBankAccount) {
                Utils.throwError(constants_1.ErrorMsg.BANKACCOUNTS.alreadyExist);
            }
            const newBankAccounts = yield bankAccount_model_1.default.create(Object.assign({ user: user.id }, args));
            return {
                message: constants_1.SuccessMsg.BANKACCOUNTS.add,
                bankDetails: newBankAccounts,
            };
        });
    }
    getBankAccounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccountDetails = yield bankAccount_model_1.default.findOne({
                where: { user: userId },
                raw: true,
            });
            if (!bankAccountDetails) {
                Utils.throwError(constants_1.ErrorMsg.BANKACCOUNTS.notFound);
            }
            return {
                message: constants_1.SuccessMsg.BANKACCOUNTS.get,
                bankDetails: bankAccountDetails,
            };
        });
    }
    updateBankAccounts(args, bankAccountsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccounts = yield bankAccount_model_1.default.findOne({
                where: { id: bankAccountsId },
            });
            if (!bankAccounts) {
                Utils.throwError(constants_1.ErrorMsg.BANKACCOUNTS.notFound);
            }
            yield bankAccount_model_1.default.update(args, { where: { id: bankAccountsId } });
            const updatedBankAccounts = yield bankAccount_model_1.default.findOne({
                where: { id: bankAccountsId },
            });
            return {
                message: constants_1.SuccessMsg.BANKACCOUNTS.update,
                bankDetails: updatedBankAccounts,
            };
        });
    }
    deleteBankAccounts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBankAccounts = yield bankAccount_model_1.default.findOne({
                where: { id: args.bankAccountsId },
            });
            if (!oldBankAccounts) {
                Utils.throwError(constants_1.ErrorMsg.BANKACCOUNTS.notFound);
            }
            yield bankAccount_model_1.default.destroy({
                where: { id: args.BankAccountsId },
            });
            return {
                message: constants_1.SuccessMsg.BANKACCOUNTS.delete,
            };
        });
    }
    cashOut(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccounts = yield bankAccount_model_1.default.findOne({
                where: { user: user.id },
            });
            if (!bankAccounts) {
                Utils.throwError(constants_1.ErrorMsg.BANKACCOUNTS.notFound);
            }
            const wallet = yield wallet_model_1.default.findOne({ where: { user: user.id }, raw: true });
            if (wallet.status === 'onhold') {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.onHoldAmount);
            }
            if (Number(args.amount) > wallet.amount) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.invalidAmount);
            }
            const txRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            const transaction = yield transaction_model_1.default.create({
                user: user.id,
                amount: Number(args.amount),
                currency: wallet.currency,
                transactionType: 'debit',
                paymentMethod: 'wallet',
                purpose: 'CashOut Request',
                tx_ref: txRefId,
                status: 'intialized',
                method: 'wallet',
                type: 'cashout',
            });
            const cashoutRequest = yield cashoutRequest_model_1.default.create({
                user: user.id,
                bankAccount: bankAccounts.id,
                amount: Number(args.amount),
                status: 'pending',
                transaction: transaction.id,
            });
            const admin = yield admin_model_1.default.findOne({ raw: true });
            yield notifications_model_1.default.create({
                admin: admin.id,
                title: 'Cash Out Request',
                type: 'cashout_request',
                body: `Driver ${user.name} has cashout request.`,
                meta_data: { cashouRequestId: cashoutRequest.id },
            });
            const balance = (wallet.amount - Number(args.amount)).toFixed(2);
            yield wallet_model_1.default.update({ status: 'onhold', amount: balance, onholdAmount: args.amount }, { where: { user: user.id } });
            return {
                message: constants_1.SuccessMsg.BANKACCOUNTS.cashout,
            };
        });
    }
})();
//# sourceMappingURL=bankAccount.service.js.map