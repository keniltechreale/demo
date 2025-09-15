import CashoutRequest, { ICashoutRequests } from '../../models/cashoutRequest.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import Users, { IUser } from '../../models/users.model';
import Wallets from '../../models/wallet.model';
import { sendDriverNotification } from '../../lib/notifications.utils';
import BankAccounts from '../../models/bankAccount.model';
import Transactions from '../../models/transaction.model';
import { sendCashOutRequest } from '../../lib/email.utils';
import { Op } from 'sequelize';
export default new (class CashoutRequestervice {
  async getAllCashoutRequest(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [{ amount: { [Op.like]: `%${search}%` } }],
      };
    }

    const totalCount = await CashoutRequest.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const cashoutRequestDetails = await CashoutRequest.findAll({
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
  }

  async updateCashoutRequest(args: Record<string, unknown>, cashoutRequestId: string) {
    const cashoutRequest: ICashoutRequests = await CashoutRequest.findOne({
      where: { id: cashoutRequestId },
    });
    if (!cashoutRequest) {
      Utils.throwError(ErrorMsg.CASHOUT.notFound);
    }
    if (cashoutRequest.status !== 'pending') {
      Utils.throwError(ErrorMsg.CASHOUT.cannotUpdate);
    }
    const wallet = await Wallets.findOne({ where: { user: cashoutRequest.user }, raw: true });

    if (args.status === 'rejected') {
      const balance = Number(Number(wallet.amount) + Number(wallet.onholdAmount)).toFixed(2);

      await Wallets.update(
        { status: 'active', amount: balance, onholdAmount: 0 },
        { where: { user: cashoutRequest.user } },
      );
    } else if (args.status === 'approved') {
      const proof = args.payment_proof;

      if (typeof proof !== 'string' || proof.trim() === '') {
        Utils.throwError(ErrorMsg.CASHOUT.imageNotFound);
      }

      // console.log('helllllloooo----> ', args, cashoutRequest.payment_proof);
      await Wallets.update(
        { status: 'active', onholdAmount: 0 },
        { where: { user: cashoutRequest.user } },
      );
    }
    await CashoutRequest.update(args, { where: { id: cashoutRequestId } });
    const updatedCashoutRequest: ICashoutRequests = await CashoutRequest.findOne({
      where: { id: cashoutRequestId },
      raw: true,
    });
    const user: IUser = await Users.findOne({ where: { id: cashoutRequest.user } });
    await sendDriverNotification(user, {
      title: `Cashout Request ${args.status as string}!`,
      body: `You request for cashout request from admin is ${args.status as string}`,
      data: {},
      type: `cashoutRequest`,
    });

    const status = args.status === 'approved' ? 'success' : 'failed';
    await Transactions.update(
      { status: status },
      { where: { id: updatedCashoutRequest.transaction } },
    );

    await sendCashOutRequest(user.email, updatedCashoutRequest);
    return {
      message: SuccessMsg.CASHOUT.update,
      cashoutRequest: updatedCashoutRequest,
    };
  }
})();
