import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Users from './users.model';
import Admin from './admin.model';
class Notification extends Model {
}
Notification.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Users,
            key: 'id',
        },
    },
    admin: {
        type: DataTypes.INTEGER.UNSIGNED,
        references: {
            model: Admin,
            key: 'id',
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    meta_data: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
});
Notification.belongsTo(Users, { foreignKey: 'user', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Notification.belongsTo(Admin, { foreignKey: 'admin', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
export default Notification;
//# sourceMappingURL=notifications.model.js.map