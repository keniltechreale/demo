"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const vehicleTypes_model_1 = __importDefault(require("./vehicleTypes.model"));
class Category extends sequelize_1.Model {
}
Category.init({
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
    type: {
        type: sequelize_1.DataTypes.ENUM('career', 'vehicle', 'feedback', 'footer'),
        allowNull: false,
    },
    stars: {
        type: sequelize_1.DataTypes.DECIMAL(3, 1),
        allowNull: true,
    },
    image: {
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
    keywords: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
    },
    link: {
        type: sequelize_1.DataTypes.STRING,
    },
    vehicleType: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: vehicleTypes_model_1.default,
            key: 'id',
        },
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Category',
    tableName: 'categories',
    timestamps: true,
});
Category.belongsTo(vehicleTypes_model_1.default, { foreignKey: 'vehicleType', targetKey: 'id' });
exports.default = Category;
//# sourceMappingURL=category.model.js.map