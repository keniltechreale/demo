import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface ICityManagement {
  id: number;
  vehicleTypes: number[];
  country: string;
  state: string;
  city: string;
  currency: string;
  symbol: string;
  code: string;
  distanceUnit: 'km' | 'miles';
  status: 'active' | 'inactive';
  documents: number[];
}

class CityManagement extends Model implements ICityManagement {
  public id!: number;
  public country!: string;
  public state!: string;
  public city!: string;
  public currency!: string;
  public symbol!: string;
  public code!: string;
  public distanceUnit!: 'km' | 'miles';
  public status!: 'active' | 'inactive';
  public vehicleTypes!: number[];
  public documents!: number[];
}

CityManagement.init(
  {
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
    },
    code: {
      type: DataTypes.STRING,
    },
    symbol: {
      type: DataTypes.STRING,
    },
    vehicleTypes: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    documents: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    distanceUnit: {
      type: DataTypes.ENUM('km', 'miles'),
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'CityManagement',
    tableName: 'city_managements',
    timestamps: true,
  },
);

export default CityManagement;
