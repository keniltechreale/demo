var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import BankAccounts from '../../models/bankAccount.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Wallets from '../../models/wallet.model';
import CashoutRequests from '../../models/cashoutRequest.model';
import Admin from '../../models/admin.model';
import Notifications from '../../models/notifications.model';
import Transactions from '../../models/transaction.model';
import { generateTransactionRef } from '../../lib/helpFunctions';
export default new (class BankAccountservice {
    addBankAccounts(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.role !== 'driver') {
                Utils.throwError(ErrorMsg.BANKACCOUNTS.invalidUser);
            }
            const existBankAccount = yield BankAccounts.findOne({
                where: { user: user.id },
                raw: true,
            });
            if (existBankAccount) {
                Utils.throwError(ErrorMsg.BANKACCOUNTS.alreadyExist);
            }
            const newBankAccounts = yield BankAccounts.create(Object.assign({ user: user.id }, args));
            return {
                message: SuccessMsg.BANKACCOUNTS.add,
                bankDetails: newBankAccounts,
            };
        });
    }
    getBankAccounts(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccountDetails = yield BankAccounts.findOne({
                where: { user: userId },
                raw: true,
            });
            if (!bankAccountDetails) {
                Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
            }
            return {
                message: SuccessMsg.BANKACCOUNTS.get,
                bankDetails: bankAccountDetails,
            };
        });
    }
    updateBankAccounts(args, bankAccountsId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccounts = yield BankAccounts.findOne({
                where: { id: bankAccountsId },
            });
            if (!bankAccounts) {
                Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
            }
            yield BankAccounts.update(args, { where: { id: bankAccountsId } });
            const updatedBankAccounts = yield BankAccounts.findOne({
                where: { id: bankAccountsId },
            });
            return {
                message: SuccessMsg.BANKACCOUNTS.update,
                bankDetails: updatedBankAccounts,
            };
        });
    }
    deleteBankAccounts(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBankAccounts = yield BankAccounts.findOne({
                where: { id: args.bankAccountsId },
            });
            if (!oldBankAccounts) {
                Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
            }
            yield BankAccounts.destroy({
                where: { id: args.BankAccountsId },
            });
            return {
                message: SuccessMsg.BANKACCOUNTS.delete,
            };
        });
    }
    cashOut(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const bankAccounts = yield BankAccounts.findOne({
                where: { user: user.id },
            });
            if (!bankAccounts) {
                Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
            }
            const wallet = yield Wallets.findOne({ where: { user: user.id }, raw: true });
            if (wallet.status === 'onhold') {
                Utils.throwError(ErrorMsg.WALLETS.onHoldAmount);
            }
            if (Number(args.amount) > wallet.amount) {
                Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
            }
            const txRefId = generateTransactionRef(12);
            const transaction = yield Transactions.create({
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
            const cashoutRequest = yield CashoutRequests.create({
                user: user.id,
                bankAccount: bankAccounts.id,
                amount: Number(args.amount),
                status: 'pending',
                transaction: transaction.id,
            });
            const admin = yield Admin.findOne({ raw: true });
            yield Notifications.create({
                admin: admin.id,
                title: 'Cash Out Request',
                type: 'cashout_request',
                body: `Driver ${user.name} has cashout request.`,
                meta_data: { cashouRequestId: cashoutRequest.id },
            });
            const balance = (wallet.amount - Number(args.amount)).toFixed(2);
            yield Wallets.update({ status: 'onhold', amount: balance, onholdAmount: args.amount }, { where: { user: user.id } });
            return {
                message: SuccessMsg.BANKACCOUNTS.cashout,
            };
        });
    }
})();
//# sourceMappingURL=bankAccount.service.js.map