import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IBankAccounts {
  id: number;
  user: number;
  holderName: string;
  bankName: string;
  bankCode: string;
  branchCode: string;
  routingNumber: string;
  accountNumber: string;
  dateOfBirth: Date;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  status: 'active' | 'inactive' | 'onhold' | 'transactionInProcess';
}

class BankAccounts extends Model<IBankAccounts> implements IBankAccounts {
  public id!: number;
  public user!: number;
  public holderName!: string;
  public bankName!: string;
  public bankCode!: string;
  public branchCode!: string;
  public routingNumber!: string;
  public accountNumber!: string;
  public dateOfBirth!: Date;
  public address!: string;
  public city!: string;
  public state!: string;
  public status!: 'active' | 'inactive' | 'onhold' | 'transactionInProcess';
  public postalCode!: string;
}

BankAccounts.init(
  {
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
  },
  {
    sequelize,
    modelName: 'BankAccounts',
    tableName: 'bank_accounts',
    timestamps: true,
  },
);

export default BankAccounts;
