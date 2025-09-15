"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
const rides_model_1 = __importDefault(require("./rides.model"));
class Rating extends sequelize_1.Model {
}
Rating.init({
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
    driver: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    ride: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: rides_model_1.default,
            key: 'id',
        },
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    stars: {
        type: sequelize_1.DataTypes.DECIMAL(3, 1),
        allowNull: true,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: true,
});
Rating.belongsTo(users_model_1.default, {
    foreignKey: 'user',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Rating.belongsTo(users_model_1.default, {
    foreignKey: 'driver',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Rating.belongsTo(rides_model_1.default, {
    foreignKey: 'ride',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
exports.default = Rating;
//# sourceMappingURL=ratings.model.js.map