import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class FAQs extends Model {
}
FAQs.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    answer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    serial_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize,
    modelName: 'FAQs',
    tableName: 'faqs',
    timestamps: true,
});
export default FAQs;
//# sourceMappingURL=faqs.model.js.map