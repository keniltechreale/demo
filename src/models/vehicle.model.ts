import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import User, { IUser } from './users.model';
import VehicleTypes, { IVehicleTypes } from './vehicleTypes.model';
import Category, { ICategory } from './category.model';

export interface IVehicleDocument {
  title: string;
  name: string;
  url: string[];
  status: 'pending' | 'approved' | 'rejected';
  reason: string | null;
}
export interface IVehicle {
  id: number;
  user: number;
  type: number;
  category: number;
  vehicle_platenumber?: string;
  vehicle_model: string;
  vehicle_color?: string;
  documents: IVehicleDocument[];
  verified: boolean;
  showCard: boolean;
  User?: IUser;
  pictures?: string[];
  VehicleType?: IVehicleTypes;
  Category?: ICategory;
}

class Vehicle extends Model<IVehicle> implements IVehicle {
  public id!: number;
  public user!: number;
  public type!: number;
  public category!: number;
  public vehicle_platenumber!: string | null;
  public vehicle_model!: string;
  public vehicle_color!: string | null;
  public documents!: IVehicleDocument[];
  public verified!: boolean;
  public showCard!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  User?: IUser;
  VehicleType?: VehicleTypes;
}

Vehicle.init(
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
    type: {
      type: DataTypes.NUMBER,
      allowNull: false,
      references: {
        model: VehicleTypes,
        key: 'id',
      },
    },
    category: {
      type: DataTypes.NUMBER,
      references: {
        model: Category,
        key: 'id',
      },
    },
    vehicle_platenumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_color: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    showCard: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    documents: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    modelName: 'Vehicle',
    tableName: 'vehicles',
    timestamps: true,
  },
);

Vehicle.belongsTo(User, { foreignKey: 'user', targetKey: 'id' });
Vehicle.belongsTo(VehicleTypes, { foreignKey: 'type', targetKey: 'id' });
Vehicle.belongsTo(Category, { foreignKey: 'category', targetKey: 'id' });

export default Vehicle;
