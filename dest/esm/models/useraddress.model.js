import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class UserAddress extends Model {
}
UserAddress.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pin_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'useraddress',
    timestamps: true,
});
export default UserAddress;
//# sourceMappingURL=useraddress.model.js.map