"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const citymanagement_model_1 = __importDefault(require("./citymanagement.model"));
const vehicleTypes_model_1 = __importDefault(require("./vehicleTypes.model"));
const category_model_1 = __importDefault(require("./category.model"));
class PriceManagement extends sequelize_1.Model {
}
PriceManagement.init({
    vehicleType: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: vehicleTypes_model_1.default,
            key: 'id',
        },
    },
    vehicleCategory: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: category_model_1.default,
            key: 'id',
        },
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
    },
    city: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: citymanagement_model_1.default,
            key: 'id',
        },
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
    },
    currencySymbol: {
        type: sequelize_1.DataTypes.STRING,
    },
    pricePerKg: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    pricePerKm: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    pricePerMin: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    minimumFareUSD: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    baseFareUSD: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    commissionPercentage: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    scheduleRideCharges: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    userCancellationTimeLimit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userCancellationCharges: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    waitingTimeLimit: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    waitingChargesUSD: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    nightCharges: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    priceNightCharges: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    nightStartTime: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    nightEndTime: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'PriceManagement',
    tableName: 'price_managements',
    timestamps: true,
});
PriceManagement.belongsTo(vehicleTypes_model_1.default, {
    foreignKey: 'vehicleType',
    as: 'VehicleTypesData',
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
});
PriceManagement.belongsTo(citymanagement_model_1.default, { foreignKey: 'city', as: 'cityData', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
PriceManagement.belongsTo(category_model_1.default, { foreignKey: 'vehicleCategory', as: 'vehicleCategoryData', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = PriceManagement;
//# sourceMappingURL=pricemanagement.model.js.map