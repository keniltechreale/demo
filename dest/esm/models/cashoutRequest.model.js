import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Users from './users.model';
import BankAccounts from './bankAccount.model';
class CashoutRequests extends Model {
}
CashoutRequests.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
    },
    bankAccount: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
            model: BankAccounts,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.NUMBER,
    },
    payment_proof: {
        type: DataTypes.STRING,
    },
    message: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'approved', 'rejected'),
    },
    transaction: {
        type: DataTypes.NUMBER,
    },
}, {
    sequelize,
    modelName: 'CashoutRequests',
    tableName: 'cashout_requests',
    timestamps: true,
});
CashoutRequests.belongsTo(Users, { foreignKey: 'user', targetKey: 'id' });
CashoutRequests.belongsTo(BankAccounts, { foreignKey: 'bankAccount', targetKey: 'id' });
export default CashoutRequests;
//# sourceMappingURL=cashoutRequest.model.js.map