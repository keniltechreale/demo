"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class BankAccounts extends sequelize_1.Model {
}
BankAccounts.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    holderName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bankName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bankCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    branchCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    routingNumber: {
        type: sequelize_1.DataTypes.STRING,
    },
    accountNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
    },
    postalCode: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'onhold', 'transactionInProcess'),
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'BankAccounts',
    tableName: 'bank_accounts',
    timestamps: true,
});
exports.default = BankAccounts;
//# sourceMappingURL=bankAccount.model.js.map