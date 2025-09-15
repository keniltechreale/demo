import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Users from './users.model';
class EmergencyContact extends Model {
}
EmergencyContact.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
    },
    isoCode: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    relationship: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize,
    modelName: 'EmergencyContact',
    tableName: 'emergency_contacts',
    timestamps: true,
});
EmergencyContact.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
export default EmergencyContact;
//# sourceMappingURL=emergencycontact.model.js.map