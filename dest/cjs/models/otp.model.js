"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class OTP extends sequelize_1.Model {
}
OTP.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    otp: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('emergency_contact', 'register', 'login', 'forgot_mpin', 'pickup', 'delivered', 'forgot_password'),
        allowNull: true,
    },
    createAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: Date.now(),
    },
    ride: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Otp',
    tableName: 'otp',
    timestamps: false,
});
exports.default = OTP;
//# sourceMappingURL=otp.model.js.map