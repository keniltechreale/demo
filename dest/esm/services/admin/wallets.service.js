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
import { generateTransactionRef } from '../../lib/helpFunctions';
import Transactions from '../../models/transaction.model';
import Ride from '../../models/rides.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import Vehicles from '../../models/vehicle.model';
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
    addedToWallet(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWallets = yield Wallets.findOne({ where: { user: userId }, raw: true });
            if (!userWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            const userBalance = (Number(userWallets.amount) + Number(args.amount)).toFixed(2);
            yield Wallets.update({ amount: userBalance }, { where: { user: userId } });
            const user = yield Users.findOne({ where: { id: userId } });
            if (user.fcm_token && user.role === 'customer') {
                yield sendCustomerNotification(user, {
                    title: `PiuPiu Cash Credit`,
                    type: `addedWallet`,
                    body: `Here! your wallet account is credited with ${args.amount} by admin. for more details contact admin.`,
                    data: {},
                });
            }
            else if (user.fcm_token && user.role === 'driver') {
                yield sendDriverNotification(user, {
                    title: `PiuPiu Cash Credit`,
                    type: `addedWallet`,
                    body: `Here! your wallet account is credited with ${args.amount} by admin. for more details contact admin.`,
                    data: {},
                });
            }
            const txRefId = generateTransactionRef(12);
            yield Transactions.create({
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
        });
    }
    removedFromWAllet(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userWallets = yield Wallets.findOne({ where: { user: userId }, raw: true });
            if (!userWallets) {
                Utils.throwError(ErrorMsg.WALLETS.notFound);
            }
            if (Number(args.amount) >= userWallets.amount) {
                Utils.throwError(ErrorMsg.WALLETS.invalidAmount);
            }
            const userBalance = (Number(userWallets.amount) - Number(args.amount)).toFixed(2);
            yield Wallets.update({ amount: userBalance }, { where: { user: userId } });
            const user = yield Users.findOne({ where: { id: userId } });
            if (user.fcm_token && user.role === 'customer') {
                yield sendCustomerNotification(user, {
                    title: `PiuPiu Cash Debit`,
                    type: `removeWallet`,
                    body: `Alert! your amount ${args.amount} is been debited by admin. for more details contact admin.`,
                    data: {},
                });
            }
            else if (user.fcm_token && user.role === 'driver') {
                yield sendDriverNotification(user, {
                    title: `PiuPiu Cash Debit`,
                    type: `removeWallet`,
                    body: `Alert! your amount ${args.amount} is been debited by admin. for more details contact admin.`,
                    data: {},
                });
            }
            const txRefId = generateTransactionRef(12);
            yield Transactions.create({
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
        });
    }
    paymentHistory() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield Transactions.findAll({
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
        });
    }
})();
//# sourceMappingURL=wallets.service.js.map