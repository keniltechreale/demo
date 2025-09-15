"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class LegalContent extends sequelize_1.Model {
}
LegalContent.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: sequelize_1.DataTypes.STRING(50),
    },
    last_updated: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'LegalContent',
    tableName: 'legalcontents',
    timestamps: true,
});
exports.default = LegalContent;
//# sourceMappingURL=legalcontent.model.js.map