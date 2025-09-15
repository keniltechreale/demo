import BankAccounts, { IBankAccounts } from '../../models/bankAccount.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { IUser } from '../../models/users.model';
import Wallets from '../../models/wallet.model';
import CashoutRequests from '../../models/cashoutRequest.model';
import Admin from '../../models/admin.model';
import Notifications from '../../models/notifications.model';
import Transactions from '../../models/transaction.model';
import { generateTransactionRef } from '../../lib/helpFunctions';

export default new (class BankAccountservice {
  async addBankAccounts(args: Record<string, unknown>, user: IUser) {
    if (user.role !== 'driver') {
      Utils.throwError(ErrorMsg.BANKACCOUNTS.invalidUser);
    }
    const existBankAccount = await BankAccounts.findOne({
      where: { user: user.id },
      raw: true,
    });
    if (existBankAccount) {
      Utils.throwError(ErrorMsg.BANKACCOUNTS.alreadyExist);
    }
    const newBankAccounts: IBankAccounts = await BankAccounts.create({ user: user.id, ...args });

    return {
      message: SuccessMsg.BANKACCOUNTS.add,
      bankDetails: newBankAccounts,
    };
  }

  async getBankAccounts(userId: number) {
    const bankAccountDetails = await BankAccounts.findOne({
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
  }

  async updateBankAccounts(args: Record<string, unknown>, bankAccountsId: string) {
    const bankAccounts: IBankAccounts = await BankAccounts.findOne({
      where: { id: bankAccountsId },
    });
    if (!bankAccounts) {
      Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
    }

    await BankAccounts.update(args, { where: { id: bankAccountsId } });
    const updatedBankAccounts: IBankAccounts = await BankAccounts.findOne({
      where: { id: bankAccountsId },
    });

    return {
      message: SuccessMsg.BANKACCOUNTS.update,
      bankDetails: updatedBankAccounts,
    };
  }

  async deleteBankAccounts(args: Record<string, unknown>) {
    const oldBankAccounts: IBankAccounts = await BankAccounts.findOne({
      where: { id: args.bankAccountsId },
    });
    if (!oldBankAccounts) {
      Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
    }
    await BankAccounts.destroy({
      where: { id: args.BankAccountsId },
    });
    return {
      message: SuccessMsg.BANKACCOUNTS.delete,
    };
  }

  async cashOut(args: Record<string, unknown>, user: IUser) {
    const bankAccounts: IBankAccounts = await BankAccounts.findOne({
      where: { user: user.id },
    });
    if (!bankAccounts) {
      Utils.throwError(ErrorMsg.BANKACCOUNTS.notFound);
    }
    const wallet = await Wallets.findOne({ where: { user: user.id }, raw: true });
    if (wallet.status === 'onhold') {
      Utils.throwError(ErrorMsg.WALLETS.onHoldAmount);
    }
    if (Number(args.amount) > wallet.amount) {
      Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
    }

    const txRefId = generateTransactionRef(12);
    const transaction = await Transactions.create({
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

    const cashoutRequest = await CashoutRequests.create({
      user: user.id,
      bankAccount: bankAccounts.id,
      amount: Number(args.amount),
      status: 'pending',
      transaction: transaction.id,
    });
    const admin = await Admin.findOne({ raw: true });
    await Notifications.create({
      admin: admin.id,
      title: 'Cash Out Request',
      type: 'cashout_request',
      body: `Driver ${user.name} has cashout request.`,
      meta_data: { cashouRequestId: cashoutRequest.id },
    });
    const balance = (wallet.amount - Number(args.amount)).toFixed(2);
    await Wallets.update(
      { status: 'onhold', amount: balance, onholdAmount: args.amount },
      { where: { user: user.id } },
    );

    return {
      message: SuccessMsg.BANKACCOUNTS.cashout,
    };
  }
})();
