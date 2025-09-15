"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class VehicleTypes extends sequelize_1.Model {
}
VehicleTypes.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    vehicle_image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    passengerCapacity: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'VehicleType',
    tableName: 'vehicle_type',
    timestamps: true,
});
exports.default = VehicleTypes;
//# sourceMappingURL=vehicleTypes.model.js.map