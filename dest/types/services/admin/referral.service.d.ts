import Referrals, { IReferrals } from '../../models/refferal.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    getAllReferrals(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        referrals: Referrals[];
    }>;
    updateReferral(args: Record<string, unknown>, referralId: string): Promise<{
        message: string;
        referral: IReferrals;
    }>;
    deleteReferral(args: {
        referralId: string;
    }): Promise<{
        message: string;
    }>;
};
export default _default;
