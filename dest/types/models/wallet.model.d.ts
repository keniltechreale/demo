import { Model } from 'sequelize';
export interface IWallets {
    id: number;
    user: number;
    amount: number;
    currency: string;
    symbol: string;
    onholdAmount: number;
    status: 'active' | 'inactive' | 'onhold';
}
declare class Wallets extends Model implements IWallets {
    id: number;
    user: number;
    amount: number;
    currency: string;
    symbol: string;
    onholdAmount: number;
    status: 'active' | 'inactive' | 'onhold';
}
export default Wallets;
