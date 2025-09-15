"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class CityManagement extends sequelize_1.Model {
}
CityManagement.init({
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING,
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
    },
    symbol: {
        type: sequelize_1.DataTypes.STRING,
    },
    vehicleTypes: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    documents: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    distanceUnit: {
        type: sequelize_1.DataTypes.ENUM('km', 'miles'),
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'CityManagement',
    tableName: 'city_managements',
    timestamps: true,
});
exports.default = CityManagement;
//# sourceMappingURL=citymanagement.model.js.map