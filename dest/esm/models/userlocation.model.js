import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User from './users.model';
class UserLocation extends Model {
}
UserLocation.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    latitude: {
        type: DataTypes.STRING,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
    },
    online_since: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    total_online_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    average_daily_hours: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    days_online: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        defaultValue: 0,
    },
}, {
    sequelize,
    modelName: 'UserLocation',
    tableName: 'user_locations',
    timestamps: true,
});
UserLocation.belongsTo(User, { foreignKey: 'user', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', });
export default UserLocation;
//# sourceMappingURL=userlocation.model.js.map