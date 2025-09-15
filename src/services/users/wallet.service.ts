import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Wallets from '../../models/wallet.model';
import * as Utils from '../../lib/utils';
import Users from '../../models/users.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
import { ISearch } from '../../lib/common.interface';
import Rides from '../../models/rides.model';
import { Op } from 'sequelize';
import { generateTransactionRef, rideCompletion } from '../../lib/helpFunctions';
import Transactions from '../../models/transaction.model';
import Coupons from '../../models/coupon.model';
import VehicleCategory from '../../models/vehicleTypes.model';
import Vehicles from '../../models/vehicle.model';
import { io } from '../../server';

export default new (class Miscervices {
  async getWallet(userId: number) {
    const wallets = await Wallets.findOne({ where: { user: userId } });

    return {
      message: SuccessMsg.WALLETS.get,
      wallets: wallets,
    };
  }

  async UserSearch(role: string, arg: ISearch) {
    const { search } = arg;
    let filterObject: Record<string, unknown> = {};
    if (search && search.length > 0) {
      filterObject = {
        role: role,
        status: 'active',
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { phone_number: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const usersDetails = await Users.findAll({
      where: filterObject,
      attributes: ['id', 'name', 'phone_number', 'profile_picture', 'role'],
      raw: true,
    });

    return {
      message: SuccessMsg.WALLETS.get,
      user: usersDetails,
    };
  }

  async transferFunds(senderId: number, receiverId: string, args: Record<string, unknown>) {
    const receiverWallets = await Wallets.findOne({ where: { user: receiverId } });
    if (!receiverWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }
    const senderWallets = await Wallets.findOne({ where: { user: senderId } });
    if (!senderWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }
    if (senderWallets.status === 'onhold') {
      Utils.throwError(ErrorMsg.WALLETS.onHoldAmount);
    }
    console.log('senderWallets', senderWallets);
    console.log('senderWallets------------->>>', senderWallets.amount);

    const transferAmount = args.amount as number;

    if (senderWallets.amount <= transferAmount) {
      Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
    }
    const senderBalance = (Number(senderWallets.amount) - Number(args.amount)).toFixed(2);
    const receiverBalance = (Number(receiverWallets.amount) + Number(args.amount)).toFixed(2);

    await Wallets.update({ amount: receiverBalance }, { where: { user: receiverId } });
    await Wallets.update({ amount: senderBalance }, { where: { user: senderId } });

    const senderUser = await Users.findOne({ where: { id: senderId } });
    const receiverUser = await Users.findOne({ where: { id: receiverId } });

    if (receiverUser.role === 'driver' && senderUser.role === 'driver') {
      if (senderUser.fcm_token) {
        await sendDriverNotification(senderUser, {
          title: `Transfer Successful!`,
          type: `transfer_funds`,
          body: `Your transfer of ${args.amount as string} to ${receiverUser.name}. was successful.`,
          data: {},
        });
      }
      if (receiverUser.fcm_token) {
        await sendDriverNotification(receiverUser, {
          title: `Funds Received!`,
          body: `You have received ${args.amount as string} from ${senderUser.name}. Check your balance now.`,
          data: {},
          type: `transfer_funds`,
        });
      }
    }

    if (receiverUser.role === 'customer' && senderUser.role === 'customer') {
      if (senderUser.fcm_token) {
        await sendCustomerNotification(senderUser, {
          title: `Transfer Successful!`,
          type: `transfer_funds`,
          body: `Your transfer of ${args.amount as string} to ${receiverUser.name}. was successful.`,
          data: {},
        });
      }
      if (receiverUser.fcm_token) {
        await sendCustomerNotification(receiverUser, {
          title: `Funds Received!`,
          body: `You have received ${args.amount as string} from ${senderUser.name}. Check your balance now.`,
          data: {},
          type: `transfer_funds`,
        });
      }
    }
    const senderTxRefId = generateTransactionRef(12);

    await Transactions.create({
      user: senderId,
      amount: args.amount,
      currency: senderWallets.currency,
      transactionType: 'debit',
      paymentMethod: 'walletTransfer',
      purpose: 'Wallet Transfer',
      tx_ref: senderTxRefId,
      status: 'success',
      type: 'wallet',
      method: 'wallet',
      category: 'wallet',
      currentWalletbalance: senderBalance,
    });
    const receiverTxRefId = generateTransactionRef(12);
    await Transactions.create({
      user: receiverId,
      amount: args.amount,
      currency: receiverWallets.currency,
      transactionType: 'credit',
      paymentMethod: 'walletTransfer',
      purpose: 'Wallet Transfer',
      tx_ref: receiverTxRefId,
      status: 'success',
      type: 'wallet',
      method: 'wallet',
      category: 'wallet',
      currentWalletbalance: receiverBalance,
    });

    return {
      message: SuccessMsg.WALLETS.transfer,
    };
  }

  async walletPayment(rideId: string, userId: number) {
    const rides = await Rides.findOne({
      where: { id: rideId, passengerId: userId },
      include: [
        {
          model: VehicleCategory,
        },
        {
          model: Vehicles,
          attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
        },
        {
          model: Users,
          as: 'driver',
          attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
        {
          model: Users,
          as: 'passenger',
          attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
        },
        {
          model: Coupons,
        },
      ],
      raw: true,
      nest: true,
    });
    if (!rides) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }
    if (rides.paymentSuccessful) {
      Utils.throwError(ErrorMsg.RIDES.alreadyPaid);
    }

    const passengerWallets = await Wallets.findOne({ where: { user: userId }, raw: true });
    if (!passengerWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }
    const driverWallets = await Wallets.findOne({ where: { user: rides.driverId }, raw: true });
    if (!driverWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }

    if (rides.finalAmount >= passengerWallets.amount) {
      Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
    }
    const passengerBalance = (Number(passengerWallets.amount) - Number(rides.finalAmount)).toFixed(
      2,
    );
    const driverBalance = (Number(driverWallets.amount) + Number(rides.finalAmount)).toFixed(2);

    await Wallets.update({ amount: passengerBalance }, { where: { user: rides.passengerId } });
    await Wallets.update({ amount: driverBalance }, { where: { user: rides.driverId } });

    const passengerUser = await Users.findOne({ where: { id: userId } });
    const driverUser = await Users.findOne({ where: { id: rides.driverId } });
    if (passengerUser.fcm_token) {
      await sendCustomerNotification(passengerUser, {
        title: `Payment Successful!`,
        type: `accountSetUp`,
        body: `Your transfer of ${rides.finalAmount} to driver ${driverUser.name}. was successful.`,
        data: {},
      });
    }
    if (driverUser.fcm_token) {
      await sendDriverNotification(driverUser, {
        title: `Payment Received!`,
        body: `You have received ${rides.finalAmount} from passenger ${passengerUser.name}. Check you balance now.`,
        data: {},
        type: `accountSetUp`,
      });
    }
    const txRefId = generateTransactionRef(12);

    await Transactions.create({
      user: rides.passengerId,
      rideId: rides.id,
      amount: rides.finalAmount,
      currency: passengerWallets.currency,
      transactionType: 'debit',
      paymentMethod: 'wallet',
      purpose: 'Ride Payment',
      tx_ref: txRefId,
      status: 'success',
      type: 'ride',
      method: 'wallet',
      category: 'wallet',
      currentWalletbalance: passengerBalance,
    });
    await Transactions.create({
      user: rides.driverId,
      rideId: rides.id,
      amount: rides.finalAmount,
      currency: passengerWallets.currency,
      transactionType: 'credit',
      paymentMethod: 'wallet',
      purpose: 'Ride Payment',
      tx_ref: txRefId,
      status: 'success',
      type: 'ride',
      method: 'wallet',
      category: 'earning',
      currentWalletbalance: driverBalance,
    });
    console.log('Ride Details -> ', rides);
    if (rides.status === 'finishTrip') {
      await rideCompletion(rides);
    }
    await Rides.update(
      { paymentSuccessful: true, paymentStatus: 'success', paymentMethod: 'wallet' },
      { where: { id: rideId } },
    );
    const ride = await Rides.findOne({ where: { id: rideId }, raw: true });
    console.log('Ride:', ride);
    io.of(`/rides/${rideId}`).emit(`VerifyPayment_${rideId}`, {
      ride: ride,
      purpose: 'Ride Payment',
      status: 'success',
      method: 'wallet',
      paySuccess: true,
    });
    return {
      message: SuccessMsg.WALLETS.payment,
    };
  }

  async walletTipPayment(args: Record<string, unknown>, rideId: string, userId: number) {
    const rides = await Rides.findOne({ where: { id: rideId, passengerId: userId }, raw: true });
    if (!rides) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }

    const passengerWallets = await Wallets.findOne({ where: { user: userId }, raw: true });
    if (!passengerWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }
    const driverWallets = await Wallets.findOne({ where: { user: rides.driverId }, raw: true });
    if (!driverWallets) {
      Utils.throwError(ErrorMsg.WALLETS.notFound);
    }

    if (Number(args.amount) >= passengerWallets.amount) {
      Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
    }
    const passengerBalance = (Number(passengerWallets.amount) - Number(args.amount)).toFixed(2);
    const driverBalance = (Number(driverWallets.amount) + Number(args.amount)).toFixed(2);

    await Wallets.update({ amount: passengerBalance }, { where: { user: rides.passengerId } });
    await Wallets.update({ amount: driverBalance }, { where: { user: rides.driverId } });

    const passengerUser = await Users.findOne({ where: { id: userId } });
    const driverUser = await Users.findOne({ where: { id: rides.driverId } });
    if (passengerUser.fcm_token) {
      await sendCustomerNotification(passengerUser, {
        title: `Payment Successful!`,
        type: `tipPayment`,
        body: `Your transfer of ${args.amount as string} to driver ${driverUser.name}. was successful.`,
        data: {},
      });
    }
    if (driverUser.fcm_token) {
      await sendDriverNotification(driverUser, {
        title: `Tips Payment Received!`,
        body: `You have received ${args.amount as string} from passenger ${passengerUser.name}. Check you balance now.`,
        data: {},
        type: `accountSetUp`,
      });
    }
    const txRefId = generateTransactionRef(12);

    await Transactions.create({
      user: rides.passengerId,
      rideId: rides.id,
      amount: args.amount,
      currency: passengerWallets.currency,
      transactionType: 'debit',
      paymentMethod: 'wallet',
      purpose: 'Ride Tip Payment',
      tx_ref: txRefId,
      status: 'success',
      type: 'tip',
      method: 'wallet',
      category: 'wallet',
      currentWalletbalance: passengerBalance,
    });
    await Transactions.create({
      user: rides.driverId,
      rideId: rides.id,
      amount: args.amount,
      currency: passengerWallets.currency,
      transactionType: 'credit',
      paymentMethod: 'wallet',
      purpose: 'Ride Tip Payment',
      tx_ref: txRefId,
      status: 'success',
      type: 'tip',
      method: 'wallet',
      category: 'wallet',
      currentWalletbalance: driverBalance,
    });
    await Rides.update({ driversTip: args.amount }, { where: { id: rideId } });
    return {
      message: SuccessMsg.WALLETS.payment,
    };
  }
})();
