import { Model } from 'sequelize';
export interface ICoupons {
    id: number;
    title: string;
    subTitle: string;
    code: string;
    usage_limit: number;
    start_date: Date;
    end_date: Date;
    type: 'fixed_money' | 'percentage';
    minPurchaseAmount: number | null;
    maxDiscountAmount: number | null;
    applicableCategories: string[] | null;
    applicableUser: string[];
    isSpecificCoupon: boolean;
    isExpired: boolean;
    status: 'active' | 'inactive';
    count: number;
}
declare class Coupon extends Model implements ICoupons {
    id: number;
    title: string;
    subTitle: string;
    code: string;
    usage_limit: number;
    start_date: Date | null;
    end_date: Date | null;
    minPurchaseAmount: number;
    maxDiscountAmount: number;
    applicableCategories: string[];
    type: 'percentage' | 'fixed_money';
    applicableUser: string[] | null;
    isSpecificCoupon: boolean;
    isExpired: boolean;
    status: 'active' | 'inactive';
    count: number;
}
export default Coupon;
