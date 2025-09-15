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
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const sequelize_1 = require("sequelize");
const helpFunctions_1 = require("../../lib/helpFunctions");
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const coupon_model_1 = __importDefault(require("../../models/coupon.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
const server_1 = require("../../server");
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
    UserSearch(role, arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search } = arg;
            let filterObject = {};
            if (search && search.length > 0) {
                filterObject = {
                    role: role,
                    status: 'active',
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { phone_number: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const usersDetails = yield users_model_1.default.findAll({
                where: filterObject,
                attributes: ['id', 'name', 'phone_number', 'profile_picture', 'role'],
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.WALLETS.get,
                user: usersDetails,
            };
        });
    }
    transferFunds(senderId, receiverId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiverWallets = yield wallet_model_1.default.findOne({ where: { user: receiverId } });
            if (!receiverWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            const senderWallets = yield wallet_model_1.default.findOne({ where: { user: senderId } });
            if (!senderWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            if (senderWallets.status === 'onhold') {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.onHoldAmount);
            }
            console.log('senderWallets', senderWallets);
            console.log('senderWallets------------->>>', senderWallets.amount);
            const transferAmount = args.amount;
            if (senderWallets.amount <= transferAmount) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.invalidAmount);
            }
            const senderBalance = (Number(senderWallets.amount) - Number(args.amount)).toFixed(2);
            const receiverBalance = (Number(receiverWallets.amount) + Number(args.amount)).toFixed(2);
            yield wallet_model_1.default.update({ amount: receiverBalance }, { where: { user: receiverId } });
            yield wallet_model_1.default.update({ amount: senderBalance }, { where: { user: senderId } });
            const senderUser = yield users_model_1.default.findOne({ where: { id: senderId } });
            const receiverUser = yield users_model_1.default.findOne({ where: { id: receiverId } });
            if (receiverUser.role === 'driver' && senderUser.role === 'driver') {
                if (senderUser.fcm_token) {
                    yield (0, notifications_utils_1.sendDriverNotification)(senderUser, {
                        title: `Transfer Successful!`,
                        type: `transfer_funds`,
                        body: `Your transfer of ${args.amount} to ${receiverUser.name}. was successful.`,
                        data: {},
                    });
                }
                if (receiverUser.fcm_token) {
                    yield (0, notifications_utils_1.sendDriverNotification)(receiverUser, {
                        title: `Funds Received!`,
                        body: `You have received ${args.amount} from ${senderUser.name}. Check your balance now.`,
                        data: {},
                        type: `transfer_funds`,
                    });
                }
            }
            if (receiverUser.role === 'customer' && senderUser.role === 'customer') {
                if (senderUser.fcm_token) {
                    yield (0, notifications_utils_1.sendCustomerNotification)(senderUser, {
                        title: `Transfer Successful!`,
                        type: `transfer_funds`,
                        body: `Your transfer of ${args.amount} to ${receiverUser.name}. was successful.`,
                        data: {},
                    });
                }
                if (receiverUser.fcm_token) {
                    yield (0, notifications_utils_1.sendCustomerNotification)(receiverUser, {
                        title: `Funds Received!`,
                        body: `You have received ${args.amount} from ${senderUser.name}. Check your balance now.`,
                        data: {},
                        type: `transfer_funds`,
                    });
                }
            }
            const senderTxRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            yield transaction_model_1.default.create({
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
            const receiverTxRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            yield transaction_model_1.default.create({
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
                message: constants_1.SuccessMsg.WALLETS.transfer,
            };
        });
    }
    walletPayment(rideId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rides = yield rides_model_1.default.findOne({
                where: { id: rideId, passengerId: userId },
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
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: coupon_model_1.default,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!rides) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            if (rides.paymentSuccessful) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.alreadyPaid);
            }
            const passengerWallets = yield wallet_model_1.default.findOne({ where: { user: userId }, raw: true });
            if (!passengerWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            const driverWallets = yield wallet_model_1.default.findOne({ where: { user: rides.driverId }, raw: true });
            if (!driverWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            if (rides.finalAmount >= passengerWallets.amount) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.invalidAmount);
            }
            const passengerBalance = (Number(passengerWallets.amount) - Number(rides.finalAmount)).toFixed(2);
            const driverBalance = (Number(driverWallets.amount) + Number(rides.finalAmount)).toFixed(2);
            yield wallet_model_1.default.update({ amount: passengerBalance }, { where: { user: rides.passengerId } });
            yield wallet_model_1.default.update({ amount: driverBalance }, { where: { user: rides.driverId } });
            const passengerUser = yield users_model_1.default.findOne({ where: { id: userId } });
            const driverUser = yield users_model_1.default.findOne({ where: { id: rides.driverId } });
            if (passengerUser.fcm_token) {
                yield (0, notifications_utils_1.sendCustomerNotification)(passengerUser, {
                    title: `Payment Successful!`,
                    type: `accountSetUp`,
                    body: `Your transfer of ${rides.finalAmount} to driver ${driverUser.name}. was successful.`,
                    data: {},
                });
            }
            if (driverUser.fcm_token) {
                yield (0, notifications_utils_1.sendDriverNotification)(driverUser, {
                    title: `Payment Received!`,
                    body: `You have received ${rides.finalAmount} from passenger ${passengerUser.name}. Check you balance now.`,
                    data: {},
                    type: `accountSetUp`,
                });
            }
            const txRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            yield transaction_model_1.default.create({
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
            yield transaction_model_1.default.create({
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
                yield (0, helpFunctions_1.rideCompletion)(rides);
            }
            yield rides_model_1.default.update({ paymentSuccessful: true, paymentStatus: 'success', paymentMethod: 'wallet' }, { where: { id: rideId } });
            const ride = yield rides_model_1.default.findOne({ where: { id: rideId }, raw: true });
            console.log('Ride:', ride);
            server_1.io.of(`/rides/${rideId}`).emit(`VerifyPayment_${rideId}`, {
                ride: ride,
                purpose: 'Ride Payment',
                status: 'success',
                method: 'wallet',
                paySuccess: true,
            });
            return {
                message: constants_1.SuccessMsg.WALLETS.payment,
            };
        });
    }
    walletTipPayment(args, rideId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rides = yield rides_model_1.default.findOne({ where: { id: rideId, passengerId: userId }, raw: true });
            if (!rides) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            const passengerWallets = yield wallet_model_1.default.findOne({ where: { user: userId }, raw: true });
            if (!passengerWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            const driverWallets = yield wallet_model_1.default.findOne({ where: { user: rides.driverId }, raw: true });
            if (!driverWallets) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.notFound);
            }
            if (Number(args.amount) >= passengerWallets.amount) {
                Utils.throwError(constants_1.ErrorMsg.WALLETS.invalidAmount);
            }
            const passengerBalance = (Number(passengerWallets.amount) - Number(args.amount)).toFixed(2);
            const driverBalance = (Number(driverWallets.amount) + Number(args.amount)).toFixed(2);
            yield wallet_model_1.default.update({ amount: passengerBalance }, { where: { user: rides.passengerId } });
            yield wallet_model_1.default.update({ amount: driverBalance }, { where: { user: rides.driverId } });
            const passengerUser = yield users_model_1.default.findOne({ where: { id: userId } });
            const driverUser = yield users_model_1.default.findOne({ where: { id: rides.driverId } });
            if (passengerUser.fcm_token) {
                yield (0, notifications_utils_1.sendCustomerNotification)(passengerUser, {
                    title: `Payment Successful!`,
                    type: `tipPayment`,
                    body: `Your transfer of ${args.amount} to driver ${driverUser.name}. was successful.`,
                    data: {},
                });
            }
            if (driverUser.fcm_token) {
                yield (0, notifications_utils_1.sendDriverNotification)(driverUser, {
                    title: `Tips Payment Received!`,
                    body: `You have received ${args.amount} from passenger ${passengerUser.name}. Check you balance now.`,
                    data: {},
                    type: `accountSetUp`,
                });
            }
            const txRefId = (0, helpFunctions_1.generateTransactionRef)(12);
            yield transaction_model_1.default.create({
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
            yield transaction_model_1.default.create({
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
            yield rides_model_1.default.update({ driversTip: args.amount }, { where: { id: rideId } });
            return {
                message: constants_1.SuccessMsg.WALLETS.payment,
            };
        });
    }
})();
//# sourceMappingURL=wallet.service.js.map