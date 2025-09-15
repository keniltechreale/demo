import { Model } from 'sequelize';
export interface ICashoutRequests {
    id: number;
    user: number;
    amount: number;
    bankAccount: number;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected';
    payment_proof: string;
    message: string;
    transaction: number;
}
declare class CashoutRequests extends Model<ICashoutRequests> implements ICashoutRequests {
    id: number;
    user: number;
    amount: number;
    bankAccount: number;
    status: 'pending' | 'in_progress' | 'approved' | 'rejected';
    payment_proof: string;
    message: string;
    transaction: number;
}
export default CashoutRequests;
