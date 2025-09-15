"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Feedbacks extends sequelize_1.Model {
}
Feedbacks.init({
    question: {
        type: sequelize_1.DataTypes.STRING,
    },
    keywords: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.NUMBER),
        references: {
            model: 'categories',
            key: 'id',
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('customer', 'driver'),
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Feedbacks',
    tableName: 'feedbacks',
    timestamps: true,
});
exports.default = Feedbacks;
//# sourceMappingURL=feedback.model.js.map