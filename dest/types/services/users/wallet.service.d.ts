import Wallets from '../../models/wallet.model';
import Users from '../../models/users.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    getWallet(userId: number): Promise<{
        message: string;
        wallets: Wallets;
    }>;
    UserSearch(role: string, arg: ISearch): Promise<{
        message: string;
        user: Users[];
    }>;
    transferFunds(senderId: number, receiverId: string, args: Record<string, unknown>): Promise<{
        message: string;
    }>;
    walletPayment(rideId: string, userId: number): Promise<{
        message: string;
    }>;
    walletTipPayment(args: Record<string, unknown>, rideId: string, userId: number): Promise<{
        message: string;
    }>;
};
export default _default;
