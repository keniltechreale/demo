"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
const admin_model_1 = __importDefault(require("./admin.model"));
class Notification extends sequelize_1.Model {
}
Notification.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    admin: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        references: {
            model: admin_model_1.default,
            key: 'id',
        },
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    isRead: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    meta_data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
});
Notification.belongsTo(users_model_1.default, { foreignKey: 'user', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Notification.belongsTo(admin_model_1.default, { foreignKey: 'admin', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = Notification;
//# sourceMappingURL=notifications.model.js.map