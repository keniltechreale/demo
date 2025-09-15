"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
class Wallets extends sequelize_1.Model {
}
Wallets.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    user: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING(10),
    },
    onholdAmount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'onhold'),
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Wallets',
    tableName: 'wallets',
    timestamps: true,
});
Wallets.belongsTo(users_model_1.default, { foreignKey: 'user', targetKey: 'id' });
exports.default = Wallets;
//# sourceMappingURL=wallet.model.js.map