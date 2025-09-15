import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface ITaxes {
  id: number;
  amount: number;
  type: 'percentage' | 'fixed';
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

class Taxes extends Model implements ITaxes {
  public id!: number;
  public amount!: number;
  public type!: 'percentage' | 'fixed';
  public is_active!: boolean;
  public created_at?: Date;
  public updated_at?: Date;
}

Taxes.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false,
      defaultValue: 'percentage',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Taxes',
    tableName: 'taxes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Taxes;
