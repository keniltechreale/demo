import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IAdditionalFee {
  id: number;
  type: 'VAT' | 'PlatformFee' | 'AdminFee'; // extendable
  percentage: number;
  status: 'active' | 'inactive';
  applyOn: 'ride_total' | 'cashout'; // flexible future-proofing
}

class AdditionalFee extends Model<IAdditionalFee> implements IAdditionalFee {
  public id!: number;
  public type!: 'VAT' | 'PlatformFee' | 'AdminFee';
  public percentage!: number;
  public status!: 'active' | 'inactive';
  public applyOn!: 'ride_total' | 'cashout';
}

AdditionalFee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM('VAT', 'PlatformFee', 'AdminFee'),
      allowNull: false,
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    applyOn: {
      type: DataTypes.ENUM('ride_total', 'cashout'),
      defaultValue: 'ride_total',
    },
  },
  {
    sequelize,
    modelName: 'AdditionalFee',
    tableName: 'additional_fees',
    timestamps: true,
  },
);

export default AdditionalFee;
