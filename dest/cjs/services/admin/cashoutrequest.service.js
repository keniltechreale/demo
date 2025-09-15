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
const cashoutRequest_model_1 = __importDefault(require("../../models/cashoutRequest.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const users_model_1 = __importDefault(require("../../models/users.model"));
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const bankAccount_model_1 = __importDefault(require("../../models/bankAccount.model"));
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const email_utils_1 = require("../../lib/email.utils");
const sequelize_1 = require("sequelize");
exports.default = new (class CashoutRequestervice {
    getAllCashoutRequest(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [sequelize_1.Op.or]: [{ amount: { [sequelize_1.Op.like]: `%${search}%` } }],
                };
            }
            const totalCount = yield cashoutRequest_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const cashoutRequestDetails = yield cashoutRequest_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: users_model_1.default,
                    },
                    {
                        model: bankAccount_model_1.default,
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.CASHOUT.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                cashoutRequest: cashoutRequestDetails,
            };
        });
    }
    updateCashoutRequest(args, cashoutRequestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cashoutRequest = yield cashoutRequest_model_1.default.findOne({
                where: { id: cashoutRequestId },
            });
            if (!cashoutRequest) {
                Utils.throwError(constants_1.ErrorMsg.CASHOUT.notFound);
            }
            if (cashoutRequest.status !== 'pending') {
                Utils.throwError(constants_1.ErrorMsg.CASHOUT.cannotUpdate);
            }
            const wallet = yield wallet_model_1.default.findOne({ where: { user: cashoutRequest.user }, raw: true });
            if (args.status === 'rejected') {
                const balance = Number(Number(wallet.amount) + Number(wallet.onholdAmount)).toFixed(2);
                yield wallet_model_1.default.update({ status: 'active', amount: balance, onholdAmount: 0 }, { where: { user: cashoutRequest.user } });
            }
            else if (args.status === 'approved') {
                const proof = args.payment_proof;
                if (typeof proof !== 'string' || proof.trim() === '') {
                    Utils.throwError(constants_1.ErrorMsg.CASHOUT.imageNotFound);
                }
                // console.log('helllllloooo----> ', args, cashoutRequest.payment_proof);
                yield wallet_model_1.default.update({ status: 'active', onholdAmount: 0 }, { where: { user: cashoutRequest.user } });
            }
            yield cashoutRequest_model_1.default.update(args, { where: { id: cashoutRequestId } });
            const updatedCashoutRequest = yield cashoutRequest_model_1.default.findOne({
                where: { id: cashoutRequestId },
                raw: true,
            });
            const user = yield users_model_1.default.findOne({ where: { id: cashoutRequest.user } });
            yield (0, notifications_utils_1.sendDriverNotification)(user, {
                title: `Cashout Request ${args.status}!`,
                body: `You request for cashout request from admin is ${args.status}`,
                data: {},
                type: `cashoutRequest`,
            });
            const status = args.status === 'approved' ? 'success' : 'failed';
            yield transaction_model_1.default.update({ status: status }, { where: { id: updatedCashoutRequest.transaction } });
            yield (0, email_utils_1.sendCashOutRequest)(user.email, updatedCashoutRequest);
            return {
                message: constants_1.SuccessMsg.CASHOUT.update,
                cashoutRequest: updatedCashoutRequest,
            };
        });
    }
})();
//# sourceMappingURL=cashoutrequest.service.js.map