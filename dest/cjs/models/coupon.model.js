"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Coupon extends sequelize_1.Model {
}
Coupon.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
    },
    subTitle: {
        type: sequelize_1.DataTypes.STRING,
    },
    usage_limit: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('percentage', 'fixed_money'),
    },
    minPurchaseAmount: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    maxDiscountAmount: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    applicableCategories: {
        type: sequelize_1.DataTypes.JSON,
    },
    applicableUser: {
        type: sequelize_1.DataTypes.JSON,
        defaultValue: [],
    },
    isSpecificCoupon: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isExpired: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    count: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Coupon',
    tableName: 'coupons',
    timestamps: true,
});
exports.default = Coupon;
//# sourceMappingURL=coupon.model.js.map