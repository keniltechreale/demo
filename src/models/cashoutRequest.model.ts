import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Users from './users.model';
import BankAccounts from './bankAccount.model';

export interface ICashoutRequests {
  id: number;
  user: number;
  amount: number;
  bankAccount: number;
  status: 'pending' | 'in_progress' | 'approved' | 'rejected';
  payment_proof: string;
  message: string;
  transaction: number;
}

class CashoutRequests extends Model<ICashoutRequests> implements ICashoutRequests {
  public id!: number;
  public user!: number;
  public amount!: number;
  public bankAccount!: number;
  public status!: 'pending' | 'in_progress' | 'approved' | 'rejected';
  public payment_proof!: string;
  public message!: string;
  public transaction!: number;
}

CashoutRequests.init(
  {
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
  },
  {
    sequelize,
    modelName: 'CashoutRequests',
    tableName: 'cashout_requests',
    timestamps: true,
  },
);

CashoutRequests.belongsTo(Users, { foreignKey: 'user', targetKey: 'id' });
CashoutRequests.belongsTo(BankAccounts, { foreignKey: 'bankAccount', targetKey: 'id' });

export default CashoutRequests;
