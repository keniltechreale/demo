import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class VehicleTypes extends Model {
}
VehicleTypes.init({
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
    vehicle_image: {
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
}, {
    sequelize,
    modelName: 'VehicleType',
    tableName: 'vehicle_type',
    timestamps: true,
});
export default VehicleTypes;
//# sourceMappingURL=vehicleTypes.model.js.map