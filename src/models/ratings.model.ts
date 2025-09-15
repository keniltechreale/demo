import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User, { IUser } from './users.model';
import Rides from './rides.model';

/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the rating.
 *           example: "60b9d13a12b7f70001f65b15"
 *         type:
 *           type: string
 *           description: The type of rating (e.g., product, service, delivery, etc.).
 *           example: "product"
 *         reason:
 *           type: string
 *           description: The reason for the rating.
 *           example: "Excellent service!"
 *         stars:
 *           type: number
 *           description: The rating stars out of 5.
 *           example: 4
 */

export interface IRating {
  id: number;
  user: number;
  driver: number;
  ride: number;
  type: string;
  reason: string;
  stars: number;
  User?: IUser;
}

class Rating extends Model implements IRating {
  public id!: number;
  public user!: number;
  public driver!: number;
  public ride!: number;
  public type!: string;
  public reason!: string;
  public stars!: number;
}

Rating.init(
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
    driver: {
      type: DataTypes.NUMBER,
      references: {
        model: User,
        key: 'id',
      },
    },
    ride: {
      type: DataTypes.NUMBER,
      references: {
        model: Rides,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stars: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Rating',
    tableName: 'ratings',
    timestamps: true,
  },
);

Rating.belongsTo(User, {
  foreignKey: 'user',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Rating.belongsTo(User, {
  foreignKey: 'driver',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Rating.belongsTo(Rides, {
  foreignKey: 'ride',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default Rating;
