"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
class UserLocation extends sequelize_1.Model {
}
UserLocation.init({
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
    latitude: {
        type: sequelize_1.DataTypes.STRING,
    },
    longitude: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    online_since: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    total_online_hours: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    average_daily_hours: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    days_online: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'UserLocation',
    tableName: 'user_locations',
    timestamps: true,
});
UserLocation.belongsTo(users_model_1.default, { foreignKey: 'user', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', });
exports.default = UserLocation;
//# sourceMappingURL=userlocation.model.js.map