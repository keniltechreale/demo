import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class ReferFriendsSection extends Model {
}
ReferFriendsSection.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    subTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    walletAmount: {
        type: DataTypes.NUMBER,
    },
}, {
    sequelize,
    modelName: 'ReferFriendsSection',
    tableName: 'refer_friends_section',
    timestamps: true,
});
export default ReferFriendsSection;
//# sourceMappingURL=referFriend.model.js.map