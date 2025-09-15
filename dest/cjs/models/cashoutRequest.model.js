"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
const bankAccount_model_1 = __importDefault(require("./bankAccount.model"));
class CashoutRequests extends sequelize_1.Model {
}
CashoutRequests.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    bankAccount: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: bankAccount_model_1.default,
            key: 'id',
        },
    },
    amount: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    payment_proof: {
        type: sequelize_1.DataTypes.STRING,
    },
    message: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected'),
    },
    transaction: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'CashoutRequests',
    tableName: 'cashout_requests',
    timestamps: true,
});
CashoutRequests.belongsTo(users_model_1.default, { foreignKey: 'user', targetKey: 'id' });
CashoutRequests.belongsTo(bankAccount_model_1.default, { foreignKey: 'bankAccount', targetKey: 'id' });
exports.default = CashoutRequests;
//# sourceMappingURL=cashoutRequest.model.js.map