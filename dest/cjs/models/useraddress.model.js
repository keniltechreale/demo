"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class UserAddress extends sequelize_1.Model {
}
UserAddress.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pin_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    mobile_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'UserAddress',
    tableName: 'useraddress',
    timestamps: true,
});
exports.default = UserAddress;
//# sourceMappingURL=useraddress.model.js.map