import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       required:
 *         - user
 *         - latitude
 *         - longitude
 *       properties:
 *         is:
 *           type: string
 *           description: The ID of the user.
 *         type:
 *           type: string
 *           description: The latitude coordinate of the location.
 *         name:
 *           type: string
 *           description: The longitude coordinate of the location.
 *         pin_code:
 *           type: string
 *           description: The ID of the user.
 *         mobile_number:
 *           type: string
 *           description: The ID of the user.
 *
 */

export interface IAddress {
  id: number;
  user: string;
  type: string;
  name: string;
  address: string;
  pin_code: string;
  mobile_number: string;
}

class UserAddress extends Model implements IAddress {
  public id!: number;
  public user!: string;
  public type!: string;
  public name!: string;
  public address!: string;
  public pin_code!: string;
  public mobile_number!: string;
}

UserAddress.init(
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pin_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserAddress',
    tableName: 'useraddress',
    timestamps: true,
  },
);

export default UserAddress;
