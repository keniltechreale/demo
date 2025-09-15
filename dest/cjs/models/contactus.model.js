"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class ContactUs extends sequelize_1.Model {
}
ContactUs.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    replied: { type: sequelize_1.DataTypes.STRING },
    replyContent: { type: sequelize_1.DataTypes.STRING },
    message: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'ContactUs',
    tableName: 'contact_us',
    timestamps: true,
});
exports.default = ContactUs;
//# sourceMappingURL=contactus.model.js.map