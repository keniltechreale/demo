import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Users extends Model {
}
Users.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date_of_birth: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    referral_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pincode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.ENUM('customer', 'driver'),
        allowNull: true,
    },
    profile_picture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verify_account: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    biometric_lock: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    is_business_account: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active',
    },
    refer_friends_with: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fcm_token: {
        type: DataTypes.STRING,
    },
    driver_available: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    ongoing_rides: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    is_driver_online: {
        type: DataTypes.BOOLEAN,
    },
    driver_vehicle_type: {
        type: DataTypes.STRING,
    },
    driver_vehicle_category: {
        type: DataTypes.STRING,
    },
    currency: {
        type: DataTypes.STRING,
    },
    deleted_at: {
        type: DataTypes.DATE,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
});
export default Users;
//# sourceMappingURL=users.model.js.map