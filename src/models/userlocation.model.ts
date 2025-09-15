import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User, { IUser } from './users.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - user
 *         - latitude
 *         - longitude
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user.
 *         latitude:
 *           type: string
 *           description: The latitude coordinate of the location.
 *         longitude:
 *           type: string
 *           description: The longitude coordinate of the location.
 */

export interface ILocation {
  dataValues: any;
  id: number;
  user: string;
  latitude: string;
  longitude: string;
  status: boolean;
  online_since: Date;
  total_online_hours: number;
  average_daily_hours: number;
  days_online: number;
  User?: IUser;
}

class UserLocation extends Model implements ILocation {
  public id!: number;
  public user!: string;
  public latitude!: string;
  public longitude!: string;
  public status!: boolean;
  public online_since!: Date;
  public total_online_hours!: number;
  public average_daily_hours!: number;
  public days_online!: number;
  User?: IUser;
}

UserLocation.init(
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
        model: User,
        key: 'id',
      },
    },
    latitude: {
      type: DataTypes.STRING,
    },
    longitude: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
    online_since: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    total_online_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    average_daily_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    days_online: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'UserLocation',
    tableName: 'user_locations',
    timestamps: true,
  },
);

UserLocation.belongsTo(User, { foreignKey: 'user', targetKey: 'id', onDelete: 'CASCADE',  onUpdate: 'CASCADE',   });

export default UserLocation;
