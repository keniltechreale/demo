import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class Feedbacks extends Model {
}
Feedbacks.init({
    question: {
        type: DataTypes.STRING,
    },
    keywords: {
        type: DataTypes.ARRAY(DataTypes.NUMBER),
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    role: {
        type: DataTypes.ENUM('customer', 'driver'),
    },
}, {
    sequelize,
    modelName: 'Feedbacks',
    tableName: 'feedbacks',
    timestamps: true,
});
export default Feedbacks;
//# sourceMappingURL=feedback.model.js.map