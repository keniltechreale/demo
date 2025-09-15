"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Referrals extends sequelize_1.Model {
}
Referrals.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    referrer_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    referee_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
    },
    referral_code: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'expired'),
        defaultValue: 'pending',
    },
    valid_until: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    referrer_use_count: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    referee_use_count: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Referrals',
    tableName: 'referrals',
    timestamps: true,
});
exports.default = Referrals;
//# sourceMappingURL=refferal.model.js.map