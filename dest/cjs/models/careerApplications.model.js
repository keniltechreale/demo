"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class CareerApplications extends sequelize_1.Model {
}
CareerApplications.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    career_id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    resume: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired'),
        defaultValue: 'pending',
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'CareerApplications',
    tableName: 'career_applications',
    timestamps: true,
});
exports.default = CareerApplications;
//# sourceMappingURL=careerApplications.model.js.map