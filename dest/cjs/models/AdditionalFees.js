"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class AdditionalFee extends sequelize_1.Model {
}
AdditionalFee.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('VAT', 'PlatformFee', 'AdminFee'),
        allowNull: false,
    },
    percentage: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    applyOn: {
        type: sequelize_1.DataTypes.ENUM('ride_total', 'cashout'),
        defaultValue: 'ride_total',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'AdditionalFee',
    tableName: 'additional_fees',
    timestamps: true,
});
exports.default = AdditionalFee;
//# sourceMappingURL=AdditionalFees.js.map