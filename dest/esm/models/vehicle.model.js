import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User from './users.model';
import VehicleTypes from './vehicleTypes.model';
import Category from './category.model';
class Vehicle extends Model {
}
Vehicle.init({
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
    type: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: VehicleTypes,
            key: 'id',
        },
    },
    category: {
        type: DataTypes.NUMBER,
        references: {
            model: Category,
            key: 'id',
        },
    },
    vehicle_platenumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    vehicle_model: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    vehicle_color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    showCard: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    documents: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
}, {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
});
Vehicle.belongsTo(User, { foreignKey: 'user', targetKey: 'id' });
Vehicle.belongsTo(VehicleTypes, { foreignKey: 'type', targetKey: 'id' });
Vehicle.belongsTo(Category, { foreignKey: 'category', targetKey: 'id' });
export default Vehicle;
//# sourceMappingURL=vehicle.model.js.map