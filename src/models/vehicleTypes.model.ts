import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IVehicleTypes {
  id: number;
  name: string;
  vehicle_image: string;
  passengerCapacity: number;
  status: boolean;
  description: string;
}

class VehicleTypes extends Model implements IVehicleTypes {
  public id!: number;
  public name!: string;
  public vehicle_image!: string;
  public passengerCapacity!: number;
  public status!: boolean;
  public description!: string;
}

VehicleTypes.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vehicle_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passengerCapacity: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'VehicleType',
    tableName: 'vehicle_type',
    timestamps: true,
  },
);

export default VehicleTypes;
