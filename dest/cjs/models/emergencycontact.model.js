"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const users_model_1 = __importDefault(require("./users.model"));
class EmergencyContact extends sequelize_1.Model {
}
EmergencyContact.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    isoCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    contact_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    relationship: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    country_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'EmergencyContact',
    tableName: 'emergency_contacts',
    timestamps: true,
});
EmergencyContact.belongsTo(users_model_1.default, { foreignKey: 'user_id', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = EmergencyContact;
//# sourceMappingURL=emergencycontact.model.js.map