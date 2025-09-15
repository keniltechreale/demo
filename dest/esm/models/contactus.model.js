import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class ContactUs extends Model {
}
ContactUs.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    replied: { type: DataTypes.STRING },
    replyContent: { type: DataTypes.STRING },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'ContactUs',
    tableName: 'contact_us',
    timestamps: true,
});
export default ContactUs;
//# sourceMappingURL=contactus.model.js.map