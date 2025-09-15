import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Ride from './rides.model';
export interface ITransaction extends Model {
  id?: number;
  user: number;
  rideId: number;
  amount: number;
  transactionType: string;
  currency: string;
  transactionId: string;
  status: string;
  type: string;
  purpose: string;
  createdAt?: Date;
  updatedAt?: Date;
  tx_ref: string;
  flw_ref: string;
  device_fingerprint: string;
  charged_amount: number;
  app_fee: number;
  merchant_fee: number;
  processor_response: string;
  auth_model: string;
  ip: string;
  narration: string;
  payment_type: string;
  account_id: number;
  meta: object;
  amount_settled: number;
  customer: object;
  currentWalletbalance: number;
  method: string;
  category: string;
}

class Transactions extends Model implements ITransaction {
  public id!: number;
  public user!: number;
  public rideId!: number;
  public amount!: number;
  public transactionType!: string;
  public currency!: string;
  public transactionId!: string;
  public status!: string;
  public purpose!: string;
  public type!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public tx_ref!: string;
  public flw_ref!: string;
  public device_fingerprint!: string;
  public charged_amount!: number;
  public app_fee!: number;
  public merchant_fee!: number;
  public processor_response!: string;
  public auth_model!: string;
  public ip!: string;
  public narration!: string;
  public payment_type!: string;
  public account_id!: number;
  public meta!: object;
  public amount_settled!: number;
  public customer!: object;
  public currentWalletbalance!: number;
  public method!: string;
  totalEarnings: string;
  category: string;
}

Transactions.init(
  {
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
  },
  {
    sequelize,
    modelName: 'Transactions',
    tableName: 'transactions',
    timestamps: true,
  },
);

Transactions.belongsTo(Ride, { foreignKey: 'rideId', targetKey: 'id' ,onDelete: 'CASCADE',  onUpdate: 'CASCADE', });

export default Transactions;
