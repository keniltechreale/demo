"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Blogs extends sequelize_1.Model {
}
Blogs.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    subtitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    author: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    author_image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Blogs',
    tableName: 'blogs',
    timestamps: true,
});
exports.default = Blogs;
//# sourceMappingURL=blogs.model.js.map