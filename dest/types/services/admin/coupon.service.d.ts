import Coupons, { ICoupons } from '../../models/coupon.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    addCoupons(args: Record<string, unknown>): Promise<{
        message: string;
        coupon: ICoupons;
    }>;
    getAllCoupons(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        coupon: Coupons[];
    }>;
    updateCoupons(args: Record<string, unknown>, couponId: string): Promise<{
        message: string;
        coupon: ICoupons;
    }>;
    deleteCoupons(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
