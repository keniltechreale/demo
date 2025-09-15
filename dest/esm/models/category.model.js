import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import VehicleTypes from './vehicleTypes.model';
class Category extends Model {
}
Category.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('career', 'vehicle', 'feedback', 'footer'),
        allowNull: false,
    },
    stars: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    passengerCapacity: {
        type: DataTypes.NUMBER,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    keywords: {
        type: DataTypes.ARRAY(DataTypes.STRING),
    },
    link: {
        type: DataTypes.STRING,
    },
    vehicleType: {
        type: DataTypes.NUMBER,
        references: {
            model: VehicleTypes,
            key: 'id',
        },
    },
}, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
});
Category.belongsTo(VehicleTypes, { foreignKey: 'vehicleType', targetKey: 'id' });
export default Category;
//# sourceMappingURL=category.model.js.map