"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class Document extends sequelize_1.Model {
}
Document.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    key: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    maxFileCounts: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    maxSize: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
    },
    vehicleTypes: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.INTEGER),
    },
    isRequired: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: true,
});
exports.default = Document;
//# sourceMappingURL=documents.model.js.map