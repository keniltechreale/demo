import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Ride from './rides.model';
class Transactions extends Model {
}
Transactions.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    user: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rideId: {
        type: DataTypes.NUMBER,
        references: {
            model: Ride,
            key: 'id',
        },
    },
    transactionType: {
        type: DataTypes.ENUM('credit', 'debit'),
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
    },
    transactionId: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.ENUM('success', 'failed', 'intialized', 'inprogress'),
    },
    purpose: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.ENUM('ride', 'wallet', 'tip', 'cashout'),
    },
    tx_ref: {
        type: DataTypes.STRING,
    },
    flw_ref: {
        type: DataTypes.STRING,
    },
    device_fingerprint: {
        type: DataTypes.STRING,
    },
    charged_amount: {
        type: DataTypes.DECIMAL(10, 2),
    },
    app_fee: {
        type: DataTypes.DECIMAL(10, 2),
    },
    merchant_fee: {
        type: DataTypes.DECIMAL(10, 2),
    },
    processor_response: {
        type: DataTypes.STRING,
    },
    auth_model: {
        type: DataTypes.STRING,
    },
    ip: {
        type: DataTypes.STRING,
    },
    narration: {
        type: DataTypes.STRING,
    },
    payment_type: {
        type: DataTypes.STRING,
    },
    account_id: {
        type: DataTypes.NUMBER,
    },
    meta: {
        type: DataTypes.JSON,
    },
    amount_settled: {
        type: DataTypes.DECIMAL(10, 2),
    },
    customer: {
        type: DataTypes.JSON,
    },
    currentWalletbalance: {
        type: DataTypes.DECIMAL(10, 2),
    },
    method: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'Transactions',
    tableName: 'transactions',
    timestamps: true,
});
Transactions.belongsTo(Ride, { foreignKey: 'rideId', targetKey: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE', });
export default Transactions;
//# sourceMappingURL=transaction.model.js.map