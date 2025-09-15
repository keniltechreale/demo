import Wallets from '../../models/wallet.model';
import { ITransaction } from '../../models/transaction.model';
declare const _default: {
    getWallet(userId: string): Promise<{
        message: string;
        wallets: Wallets;
    }>;
    addedToWallet(args: Record<string, unknown>, userId: string): Promise<{
        message: string;
    }>;
    removedFromWAllet(args: Record<string, unknown>, userId: string): Promise<{
        message: string;
    }>;
    paymentHistory(): Promise<{
        message: string;
        transactions: ITransaction[];
    }>;
};
export default _default;
