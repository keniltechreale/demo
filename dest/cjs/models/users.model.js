"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Users extends sequelize_1.Model {
}
Users.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    region: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    referral_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pincode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('customer', 'driver'),
        allowNull: true,
    },
    profile_picture: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verify_account: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    biometric_lock: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_business_account: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
    },
    refer_friends_with: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    fcm_token: {
        type: sequelize_1.DataTypes.STRING,
    },
    driver_available: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    ongoing_rides: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    is_driver_online: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    driver_vehicle_type: {
        type: sequelize_1.DataTypes.STRING,
    },
    driver_vehicle_category: {
        type: sequelize_1.DataTypes.STRING,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
    },
    deleted_at: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});
exports.default = Users;
//# sourceMappingURL=users.model.js.map