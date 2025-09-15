"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
class ReferFriendsSection extends sequelize_1.Model {
}
ReferFriendsSection.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    subTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    walletAmount: {
        type: sequelize_1.DataTypes.NUMBER,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'ReferFriendsSection',
    tableName: 'refer_friends_section',
    timestamps: true,
});
exports.default = ReferFriendsSection;
//# sourceMappingURL=referFriend.model.js.map