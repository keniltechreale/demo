"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class WeeklyStatement extends sequelize_1.Model {
}
WeeklyStatement.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.NUMBER,
    },
    file: {
        type: sequelize_1.DataTypes.STRING,
    },
    startDate: {
        type: sequelize_1.DataTypes.STRING,
    },
    endDate: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'WeeklyStatement',
    tableName: 'weekly_statement',
    timestamps: true,
});
exports.default = WeeklyStatement;
//# sourceMappingURL=weeklyStatement.model.js.map