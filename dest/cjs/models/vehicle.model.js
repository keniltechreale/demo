"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
const vehicleTypes_model_1 = __importDefault(require("./vehicleTypes.model"));
const category_model_1 = __importDefault(require("./category.model"));
class Vehicle extends sequelize_1.Model {
}
Vehicle.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    type: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: vehicleTypes_model_1.default,
            key: 'id',
        },
    },
    category: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: category_model_1.default,
            key: 'id',
        },
    },
    vehicle_platenumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    vehicle_model: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    vehicle_color: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    showCard: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    documents: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
});
Vehicle.belongsTo(users_model_1.default, { foreignKey: 'user', targetKey: 'id' });
Vehicle.belongsTo(vehicleTypes_model_1.default, { foreignKey: 'type', targetKey: 'id' });
Vehicle.belongsTo(category_model_1.default, { foreignKey: 'category', targetKey: 'id' });
exports.default = Vehicle;
//# sourceMappingURL=vehicle.model.js.map