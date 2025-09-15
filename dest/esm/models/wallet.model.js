import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Users from './users.model';
class Wallets extends Model {
}
Wallets.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING(10),
        allowNull: true,
    },
    symbol: {
        type: DataTypes.STRING(10),
    },
    onholdAmount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'onhold'),
    },
}, {
    sequelize,
    modelName: 'Wallets',
    tableName: 'wallets',
    timestamps: true,
});
Wallets.belongsTo(Users, { foreignKey: 'user', targetKey: 'id' });
export default Wallets;
//# sourceMappingURL=wallet.model.js.map