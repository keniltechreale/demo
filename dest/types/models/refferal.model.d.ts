import { Model, Optional } from 'sequelize';
export interface IReferrals {
    id: number;
    referrer_id: number;
    referee_id?: number | null;
    referral_code: string;
    status: 'pending' | 'completed' | 'expired';
    valid_until?: Date | null;
    referrer_use_count: number;
    referee_use_count: number;
    createdAt?: Date;
    updatedAt?: Date;
}
type ReferralsCreationAttributes = Optional<IReferrals, 'id' | 'referee_id' | 'valid_until' | 'referrer_use_count' | 'referee_use_count' | 'createdAt' | 'updatedAt'>;
declare class Referrals extends Model<IReferrals, ReferralsCreationAttributes> implements IReferrals {
    id: number;
    referrer_id: number;
    referee_id: number | null;
    referral_code: string;
    status: 'pending' | 'completed' | 'expired';
    valid_until: Date | null;
    referrer_use_count: number;
    referee_use_count: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Referrals;
