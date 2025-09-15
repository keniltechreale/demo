import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import CityManagement from './citymanagement.model';
import VehicleTypes from './vehicleTypes.model';
import Category from './category.model';
class PriceManagement extends Model {
}
PriceManagement.init({
    vehicleType: {
        type: DataTypes.NUMBER,
        references: {
            model: VehicleTypes,
            key: 'id',
        },
    },
    vehicleCategory: {
        type: DataTypes.NUMBER,
        references: {
            model: Category,
            key: 'id',
        },
    },
    country: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.NUMBER,
        references: {
            model: CityManagement,
            key: 'id',
        },
    },
    currency: {
        type: DataTypes.STRING,
    },
    currencySymbol: {
        type: DataTypes.STRING,
    },
    pricePerKg: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    pricePerKm: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    pricePerMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    minimumFareUSD: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    baseFareUSD: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    commissionPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    scheduleRideCharges: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    userCancellationTimeLimit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    userCancellationCharges: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    waitingTimeLimit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    waitingChargesUSD: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    nightCharges: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    priceNightCharges: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    nightStartTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    nightEndTime: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize,
    modelName: 'PriceManagement',
    tableName: 'price_managements',
    timestamps: true,
});
PriceManagement.belongsTo(VehicleTypes, {
    foreignKey: 'vehicleType',
    as: 'VehicleTypesData',
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
});
PriceManagement.belongsTo(CityManagement, { foreignKey: 'city', as: 'cityData', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
PriceManagement.belongsTo(Category, { foreignKey: 'vehicleCategory', as: 'vehicleCategoryData', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
export default PriceManagement;
//# sourceMappingURL=pricemanagement.model.js.map