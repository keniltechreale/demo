import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IReferrals {
  id: number;
  referrer_id: number;
  referee_id?: number | null;
  referral_code: string;
  status: 'pending' | 'completed' | 'expired';
  valid_until?: Date | null;
  referrer_use_count: number;
  referee_use_count: number;
  createdAt?: Date;
  updatedAt?: Date;
}

type ReferralsCreationAttributes = Optional<
  IReferrals,
  | 'id'
  | 'referee_id'
  | 'valid_until'
  | 'referrer_use_count'
  | 'referee_use_count'
  | 'createdAt'
  | 'updatedAt'
>;

class Referrals extends Model<IReferrals, ReferralsCreationAttributes> implements IReferrals {
  public id!: number;
  public referrer_id!: number;
  public referee_id!: number | null;
  public referral_code!: string;
  public status!: 'pending' | 'completed' | 'expired';
  public valid_until!: Date | null;
  public referrer_use_count!: number;
  public referee_use_count!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Referrals.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    referrer_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    referee_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    referral_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'expired'),
      defaultValue: 'pending',
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referrer_use_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    referee_use_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Referrals',
    tableName: 'referrals',
    timestamps: true,
  },
);

export default Referrals;
