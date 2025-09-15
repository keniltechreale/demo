import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IOTP {
  id: number;
  user: string;
  otp: string;
  ride: string;
  type:
    | 'emergency_contact'
    | 'register'
    | 'forgot_password'
    | 'login'
    | 'forgot_mpin'
    | 'pickup'
    | 'delivered';
  createAt: Date;
}

class OTP extends Model implements IOTP {
  public id!: number;
  public ride!: string;
  public user!: string;
  public otp!: string;
  public type!:
    | 'emergency_contact'
    | 'register'
    | 'forgot_password'
    | 'login'
    | 'forgot_mpin'
    | 'pickup'
    | 'delivered';
  public createAt!: Date;
}

OTP.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING(50),
    },
    type: {
      type: DataTypes.ENUM(
        'emergency_contact',
        'register',
        'login',
        'forgot_mpin',
        'pickup',
        'delivered',
        'forgot_password',
      ),
      allowNull: true,
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Date.now(),
    },
    ride: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Otp',
    tableName: 'otp',
    timestamps: false,
  },
);

export default OTP;
