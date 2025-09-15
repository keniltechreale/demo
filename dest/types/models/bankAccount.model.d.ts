import { Model } from 'sequelize';
export interface IBankAccounts {
    id: number;
    user: number;
    holderName: string;
    bankName: string;
    bankCode: string;
    branchCode: string;
    routingNumber: string;
    accountNumber: string;
    dateOfBirth: Date;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    status: 'active' | 'inactive' | 'onhold' | 'transactionInProcess';
}
declare class BankAccounts extends Model<IBankAccounts> implements IBankAccounts {
    id: number;
    user: number;
    holderName: string;
    bankName: string;
    bankCode: string;
    branchCode: string;
    routingNumber: string;
    accountNumber: string;
    dateOfBirth: Date;
    address: string;
    city: string;
    state: string;
    status: 'active' | 'inactive' | 'onhold' | 'transactionInProcess';
    postalCode: string;
}
export default BankAccounts;
