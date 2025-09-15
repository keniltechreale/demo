"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const rides_model_1 = __importDefault(require("./rides.model"));
class Transactions extends sequelize_1.Model {
}
Transactions.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    rideId: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: rides_model_1.default,
            key: 'id',
        },
    },
    transactionType: {
        type: sequelize_1.DataTypes.ENUM('credit', 'debit'),
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
    },
    transactionId: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('success', 'failed', 'intialized', 'inprogress'),
    },
    purpose: {
        type: sequelize_1.DataTypes.STRING,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('ride', 'wallet', 'tip', 'cashout'),
    },
    tx_ref: {
        type: sequelize_1.DataTypes.STRING,
    },
    flw_ref: {
        type: sequelize_1.DataTypes.STRING,
    },
    device_fingerprint: {
        type: sequelize_1.DataTypes.STRING,
    },
    charged_amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    app_fee: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    merchant_fee: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    processor_response: {
        type: sequelize_1.DataTypes.STRING,
    },
    auth_model: {
        type: sequelize_1.DataTypes.STRING,
    },
    ip: {
        type: sequelize_1.DataTypes.STRING,
    },
    narration: {
        type: sequelize_1.DataTypes.STRING,
    },
    payment_type: {
        type: sequelize_1.DataTypes.STRING,
    },
    account_id: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    meta: {
        type: sequelize_1.DataTypes.JSON,
    },
    amount_settled: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    customer: {
        type: sequelize_1.DataTypes.JSON,
    },
    currentWalletbalance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    method: {
        type: sequelize_1.DataTypes.STRING,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Transactions',
    tableName: 'transactions',
    timestamps: true,
});
Transactions.belongsTo(rides_model_1.default, { foreignKey: 'rideId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', });
exports.default = Transactions;
//# sourceMappingURL=transaction.model.js.map