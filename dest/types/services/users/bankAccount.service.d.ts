import BankAccounts, { IBankAccounts } from '../../models/bankAccount.model';
import { IUser } from '../../models/users.model';
declare const _default: {
    addBankAccounts(args: Record<string, unknown>, user: IUser): Promise<{
        message: string;
        bankDetails: IBankAccounts;
    }>;
    getBankAccounts(userId: number): Promise<{
        message: string;
        bankDetails: BankAccounts;
    }>;
    updateBankAccounts(args: Record<string, unknown>, bankAccountsId: string): Promise<{
        message: string;
        bankDetails: IBankAccounts;
    }>;
    deleteBankAccounts(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
    cashOut(args: Record<string, unknown>, user: IUser): Promise<{
        message: string;
    }>;
};
export default _default;
