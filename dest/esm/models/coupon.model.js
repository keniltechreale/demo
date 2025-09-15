import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Coupon extends Model {
}
Coupon.init({
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
}, {
    sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
});
export default Coupon;
//# sourceMappingURL=coupon.model.js.map