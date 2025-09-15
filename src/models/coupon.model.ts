import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

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

class Coupon extends Model implements ICoupons {
  public id!: number;
  public title!: string;
  public subTitle!: string;
  public code!: string;
  public usage_limit!: number;
  public start_date!: Date | null;
  public end_date!: Date | null;
  public minPurchaseAmount!: number;
  public maxDiscountAmount!: number;
  public applicableCategories!: string[];
  public type!: 'percentage' | 'fixed_money';
  public applicableUser!: string[] | null;
  public isSpecificCoupon!: boolean;
  public isExpired!: boolean;
  public status!: 'active' | 'inactive';
  public count!: number;
}

Coupon.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    subTitle: {
      type: DataTypes.STRING,
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    start_date: {
      type: DataTypes.DATE,
    },
    end_date: {
      type: DataTypes.DATE,
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed_money'),
    },
    minPurchaseAmount: {
      type: DataTypes.NUMBER,
    },
    maxDiscountAmount: {
      type: DataTypes.NUMBER,
    },
    applicableCategories: {
      type: DataTypes.JSON,
    },
    applicableUser: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    isSpecificCoupon: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
  },
);

export default Coupon;
