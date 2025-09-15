var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Wallets from '../../models/wallet.model';
import * as Utils from '../../lib/utils';
import Users from '../../models/users.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
import Rides from '../../models/rides.model';
import { Op } from 'sequelize';
import { generateTransactionRef, rideCompletion } from '../../lib/helpFunctions';
import Transactions from '../../models/transaction.model';
import Coupons from '../../models/coupon.model';
import VehicleCategory from '../../models/vehicleTypes.model';
import Vehicles from '../../models/vehicle.model';
import { io } from '../../server';
export default new (class Miscervices {
    getWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallets = yield Wallets.findOne({ where: { user: userId } });
            return {
                message: SuccessMsg.WALLETS.get,
                wallets: wallets,
            };
        });
    }
    UserSearch(role, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search } = arg;
            let filterObject = {};
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
            const usersDetails = yield Users.findAll({
                where: filterObject,
                attributes: ['id', 'name', 'phone_number', 'profile_picture', 'role'],
                raw: true,
            });
            return {
                message: SuccessMsg.WALLETS.get,
                user: usersDetails,
            };
        });
    }
    transferFunds(senderId, receiverId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiverWallets = yield Wallets.findOne({ where: { user: receiverId } });
            if (!receiverWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            const senderWallets = yield Wallets.findOne({ where: { user: senderId } });
            if (!senderWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            if (senderWallets.status === 'onhold') {
                Utils.throwError(ErrorMsg.WALLETS.onHoldAmount);
            }
            console.log('senderWallets', senderWallets);
            console.log('senderWallets------------->>>', senderWallets.amount);
            const transferAmount = args.amount;
            if (senderWallets.amount <= transferAmount) {
                Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
            }
            const senderBalance = (Number(senderWallets.amount) - Number(args.amount)).toFixed(2);
            const receiverBalance = (Number(receiverWallets.amount) + Number(args.amount)).toFixed(2);
            yield Wallets.update({ amount: receiverBalance }, { where: { user: receiverId } });
            yield Wallets.update({ amount: senderBalance }, { where: { user: senderId } });
            const senderUser = yield Users.findOne({ where: { id: senderId } });
            const receiverUser = yield Users.findOne({ where: { id: receiverId } });
            if (receiverUser.role === 'driver' && senderUser.role === 'driver') {
                if (senderUser.fcm_token) {
                    yield sendDriverNotification(senderUser, {
                        title: `Transfer Successful!`,
                        type: `transfer_funds`,
                        body: `Your transfer of ${args.amount} to ${receiverUser.name}. was successful.`,
                        data: {},
                    });
                }
                if (receiverUser.fcm_token) {
                    yield sendDriverNotification(receiverUser, {
                        title: `Funds Received!`,
                        body: `You have received ${args.amount} from ${senderUser.name}. Check your balance now.`,
                        data: {},
                        type: `transfer_funds`,
                    });
                }
            }
            if (receiverUser.role === 'customer' && senderUser.role === 'customer') {
                if (senderUser.fcm_token) {
                    yield sendCustomerNotification(senderUser, {
                        title: `Transfer Successful!`,
                        type: `transfer_funds`,
                        body: `Your transfer of ${args.amount} to ${receiverUser.name}. was successful.`,
                        data: {},
                    });
                }
                if (receiverUser.fcm_token) {
                    yield sendCustomerNotification(receiverUser, {
                        title: `Funds Received!`,
                        body: `You have received ${args.amount} from ${senderUser.name}. Check your balance now.`,
                        data: {},
                        type: `transfer_funds`,
                    });
                }
            }
            const senderTxRefId = generateTransactionRef(12);
            yield Transactions.create({
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
            yield Transactions.create({
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
        });
    }
    walletPayment(rideId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rides = yield Rides.findOne({
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
            const passengerWallets = yield Wallets.findOne({ where: { user: userId }, raw: true });
            if (!passengerWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            const driverWallets = yield Wallets.findOne({ where: { user: rides.driverId }, raw: true });
            if (!driverWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            if (rides.finalAmount >= passengerWallets.amount) {
                Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
            }
            const passengerBalance = (Number(passengerWallets.amount) - Number(rides.finalAmount)).toFixed(2);
            const driverBalance = (Number(driverWallets.amount) + Number(rides.finalAmount)).toFixed(2);
            yield Wallets.update({ amount: passengerBalance }, { where: { user: rides.passengerId } });
            yield Wallets.update({ amount: driverBalance }, { where: { user: rides.driverId } });
            const passengerUser = yield Users.findOne({ where: { id: userId } });
            const driverUser = yield Users.findOne({ where: { id: rides.driverId } });
            if (passengerUser.fcm_token) {
                yield sendCustomerNotification(passengerUser, {
                    title: `Payment Successful!`,
                    type: `accountSetUp`,
                    body: `Your transfer of ${rides.finalAmount} to driver ${driverUser.name}. was successful.`,
                    data: {},
                });
            }
            if (driverUser.fcm_token) {
                yield sendDriverNotification(driverUser, {
                    title: `Payment Received!`,
                    body: `You have received ${rides.finalAmount} from passenger ${passengerUser.name}. Check you balance now.`,
                    data: {},
                    type: `accountSetUp`,
                });
            }
            const txRefId = generateTransactionRef(12);
            yield Transactions.create({
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
            yield Transactions.create({
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
                yield rideCompletion(rides);
            }
            yield Rides.update({ paymentSuccessful: true, paymentStatus: 'success', paymentMethod: 'wallet' }, { where: { id: rideId } });
            const ride = yield Rides.findOne({ where: { id: rideId }, raw: true });
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
        });
    }
    walletTipPayment(args, rideId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rides = yield Rides.findOne({ where: { id: rideId, passengerId: userId }, raw: true });
            if (!rides) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            const passengerWallets = yield Wallets.findOne({ where: { user: userId }, raw: true });
            if (!passengerWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            const driverWallets = yield Wallets.findOne({ where: { user: rides.driverId }, raw: true });
            if (!driverWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            if (Number(args.amount) >= passengerWallets.amount) {
                Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
            }
            const passengerBalance = (Number(passengerWallets.amount) - Number(args.amount)).toFixed(2);
            const driverBalance = (Number(driverWallets.amount) + Number(args.amount)).toFixed(2);
            yield Wallets.update({ amount: passengerBalance }, { where: { user: rides.passengerId } });
            yield Wallets.update({ amount: driverBalance }, { where: { user: rides.driverId } });
            const passengerUser = yield Users.findOne({ where: { id: userId } });
            const driverUser = yield Users.findOne({ where: { id: rides.driverId } });
            if (passengerUser.fcm_token) {
                yield sendCustomerNotification(passengerUser, {
                    title: `Payment Successful!`,
                    type: `tipPayment`,
                    body: `Your transfer of ${args.amount} to driver ${driverUser.name}. was successful.`,
                    data: {},
                });
            }
            if (driverUser.fcm_token) {
                yield sendDriverNotification(driverUser, {
                    title: `Tips Payment Received!`,
                    body: `You have received ${args.amount} from passenger ${passengerUser.name}. Check you balance now.`,
                    data: {},
                    type: `accountSetUp`,
                });
            }
            const txRefId = generateTransactionRef(12);
            yield Transactions.create({
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
            yield Transactions.create({
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
            yield Rides.update({ driversTip: args.amount }, { where: { id: rideId } });
            return {
                message: SuccessMsg.WALLETS.payment,
            };
        });
    }
})();
//# sourceMappingURL=wallet.service.js.map