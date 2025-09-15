import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class CityManagement extends Model {
}
CityManagement.init({
    country: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
    },
    code: {
        type: DataTypes.STRING,
    },
    symbol: {
        type: DataTypes.STRING,
    },
    vehicleTypes: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    documents: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    distanceUnit: {
        type: DataTypes.ENUM('km', 'miles'),
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize,
    modelName: 'CityManagement',
    tableName: 'city_managements',
    timestamps: true,
});
export default CityManagement;
//# sourceMappingURL=citymanagement.model.js.map