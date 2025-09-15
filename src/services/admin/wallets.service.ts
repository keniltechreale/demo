import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Wallets from '../../models/wallet.model';
import * as Utils from '../../lib/utils';
import Users from '../../models/users.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
import { generateTransactionRef } from '../../lib/helpFunctions';
import Transactions, { ITransaction } from '../../models/transaction.model';
import Ride from '../../models/rides.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import Vehicles from '../../models/vehicle.model';

export default new (class Miscervices {
  async getWallet(userId: string) {
    const wallets = await Wallets.findOne({ where: { user: userId } });

    return {
      message: SuccessMsg.WALLETS.get,
      wallets: wallets,
    };
  }

  async addedToWallet(args: Record<string, unknown>, userId: string) {
    const userWallets = await Wallets.findOne({ where: { user: userId }, raw: true });
    if (!userWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }
    const userBalance = (Number(userWallets.amount) + Number(args.amount)).toFixed(2);
    await Wallets.update({ amount: userBalance }, { where: { user: userId } });

    const user = await Users.findOne({ where: { id: userId } });
    if (user.fcm_token && user.role === 'customer') {
      await sendCustomerNotification(user, {
        title: `PiuPiu Cash Credit`,
        type: `addedWallet`,
        body: `Here! your wallet account is credited with ${args.amount as string} by admin. for more details contact admin.`,
        data: {},
      });
    } else if (user.fcm_token && user.role === 'driver') {
      await sendDriverNotification(user, {
        title: `PiuPiu Cash Credit`,
        type: `addedWallet`,
        body: `Here! your wallet account is credited with ${args.amount as string} by admin. for more details contact admin.`,
        data: {},
      });
    }
    const txRefId = generateTransactionRef(12);

    await Transactions.create({
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
      message: SuccessMsg.WALLETS.Addition,
    };
  }

  async removedFromWAllet(args: Record<string, unknown>, userId: string) {
    const userWallets = await Wallets.findOne({ where: { user: userId }, raw: true });
    if (!userWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }

    if (Number(args.amount) >= userWallets.amount) {
      Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
    }
    const userBalance = (Number(userWallets.amount) - Number(args.amount)).toFixed(2);
    await Wallets.update({ amount: userBalance }, { where: { user: userId } });

    const user = await Users.findOne({ where: { id: userId } });
    if (user.fcm_token && user.role === 'customer') {
      await sendCustomerNotification(user, {
        title: `PiuPiu Cash Debit`,
        type: `removeWallet`,
        body: `Alert! your amount ${args.amount as string} is been debited by admin. for more details contact admin.`,
        data: {},
      });
    } else if (user.fcm_token && user.role === 'driver') {
      await sendDriverNotification(user, {
        title: `PiuPiu Cash Debit`,
        type: `removeWallet`,
        body: `Alert! your amount ${args.amount as string} is been debited by admin. for more details contact admin.`,
        data: {},
      });
    }
    const txRefId = generateTransactionRef(12);

    await Transactions.create({
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
      message: SuccessMsg.WALLETS.removed,
    };
  }

  async paymentHistory() {
    const transactions: ITransaction[] = await Transactions.findAll({
      where: { method: 'flutterwave' },
      include: [
        {
          model: Ride,
          include: [
            {
              model: VehicleTypes,
            },
            {
              model: Vehicles,
              attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
            },
            {
              model: Users,
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
              model: Users,
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
      message: SuccessMsg.PAYMENT.earningsHistory,
      transactions,
    };
  }
})();
