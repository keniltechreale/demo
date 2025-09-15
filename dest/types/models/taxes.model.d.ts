import { Model } from 'sequelize';
export interface ITaxes {
    id: number;
    amount: number;
    type: 'percentage' | 'fixed';
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
declare class Taxes extends Model implements ITaxes {
    id: number;
    amount: number;
    type: 'percentage' | 'fixed';
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export default Taxes;
