import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
class BankAccounts extends Model {
}
BankAccounts.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    holderName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bankCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    branchCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    routingNumber: {
        type: DataTypes.STRING,
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    },
    state: {
        type: DataTypes.STRING,
    },
    postalCode: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'onhold', 'transactionInProcess'),
    },
}, {
    sequelize,
    modelName: 'BankAccounts',
    tableName: 'bank_accounts',
    timestamps: true,
});
export default BankAccounts;
//# sourceMappingURL=bankAccount.model.js.map