var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CashoutRequest from '../../models/cashoutRequest.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Users from '../../models/users.model';
import Wallets from '../../models/wallet.model';
import { sendDriverNotification } from '../../lib/notifications.utils';
import BankAccounts from '../../models/bankAccount.model';
import Transactions from '../../models/transaction.model';
import { sendCashOutRequest } from '../../lib/email.utils';
import { Op } from 'sequelize';
export default new (class CashoutRequestervice {
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
                    [Op.or]: [{ amount: { [Op.like]: `%${search}%` } }],
                };
            }
            const totalCount = yield CashoutRequest.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const cashoutRequestDetails = yield CashoutRequest.findAll({
                where: filterObject,
                include: [
                    {
                        model: Users,
                    },
                    {
                        model: BankAccounts,
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
                nest: true,
            });
            return {
                message: SuccessMsg.CASHOUT.get,
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
            const cashoutRequest = yield CashoutRequest.findOne({
                where: { id: cashoutRequestId },
            });
            if (!cashoutRequest) {
                Utils.throwError(ErrorMsg.CASHOUT.notFound);
            }
            if (cashoutRequest.status !== 'pending') {
                Utils.throwError(ErrorMsg.CASHOUT.cannotUpdate);
            }
            const wallet = yield Wallets.findOne({ where: { user: cashoutRequest.user }, raw: true });
            if (args.status === 'rejected') {
                const balance = Number(Number(wallet.amount) + Number(wallet.onholdAmount)).toFixed(2);
                yield Wallets.update({ status: 'active', amount: balance, onholdAmount: 0 }, { where: { user: cashoutRequest.user } });
            }
            else if (args.status === 'approved') {
                const proof = args.payment_proof;
                if (typeof proof !== 'string' || proof.trim() === '') {
                    Utils.throwError(ErrorMsg.CASHOUT.imageNotFound);
                }
                // console.log('helllllloooo----> ', args, cashoutRequest.payment_proof);
                yield Wallets.update({ status: 'active', onholdAmount: 0 }, { where: { user: cashoutRequest.user } });
            }
            yield CashoutRequest.update(args, { where: { id: cashoutRequestId } });
            const updatedCashoutRequest = yield CashoutRequest.findOne({
                where: { id: cashoutRequestId },
                raw: true,
            });
            const user = yield Users.findOne({ where: { id: cashoutRequest.user } });
            yield sendDriverNotification(user, {
                title: `Cashout Request ${args.status}!`,
                body: `You request for cashout request from admin is ${args.status}`,
                data: {},
                type: `cashoutRequest`,
            });
            const status = args.status === 'approved' ? 'success' : 'failed';
            yield Transactions.update({ status: status }, { where: { id: updatedCashoutRequest.transaction } });
            yield sendCashOutRequest(user.email, updatedCashoutRequest);
            return {
                message: SuccessMsg.CASHOUT.update,
                cashoutRequest: updatedCashoutRequest,
            };
        });
    }
})();
//# sourceMappingURL=cashoutrequest.service.js.map