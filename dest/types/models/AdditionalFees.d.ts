import { Model } from 'sequelize';
export interface IAdditionalFee {
    id: number;
    type: 'VAT' | 'PlatformFee' | 'AdminFee';
    percentage: number;
    status: 'active' | 'inactive';
    applyOn: 'ride_total' | 'cashout';
}
declare class AdditionalFee extends Model<IAdditionalFee> implements IAdditionalFee {
    id: number;
    type: 'VAT' | 'PlatformFee' | 'AdminFee';
    percentage: number;
    status: 'active' | 'inactive';
    applyOn: 'ride_total' | 'cashout';
}
export default AdditionalFee;
