"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Testimonials extends sequelize_1.Model {
}
Testimonials.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Testimonials',
    tableName: 'testimonials',
    timestamps: true,
});
exports.default = Testimonials;
//# sourceMappingURL=testimonial.model.js.map