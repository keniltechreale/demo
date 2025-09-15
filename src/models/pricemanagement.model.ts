import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import CityManagement, { ICityManagement } from './citymanagement.model';
import VehicleTypes, { IVehicleTypes } from './vehicleTypes.model';
import Category, { ICategory } from './category.model';

export interface IPriceManagement {
  vehicleType: number;
  vehicleCategory: number;
  country: string;
  state: string;
  city: number;
  currency: string;
  currencySymbol: string;
  pricePerKg: number | null;
  pricePerKm?: number | null;
  pricePerMin?: number | null;
  minimumFareUSD: number;
  baseFareUSD: number;
  scheduleRideCharges: number;
  commissionPercentage: number;
  userCancellationTimeLimit: number;
  userCancellationCharges: number;
  waitingTimeLimit: number;
  waitingChargesUSD: number;
  nightCharges: boolean;
  priceNightCharges: number;
  nightStartTime?: string;
  nightEndTime?: string;
  status: 'active' | 'inactive';
  cityData?: ICityManagement;
  VehicleTypesData?: IVehicleTypes;
  vehicleCategoryData?: ICategory;
}

class PriceManagement extends Model implements IPriceManagement {
  public id!: number;
  public vehicleType!: number;
  public vehicleCategory!: number;
  public country!: string;
  public state!: string;
  public city!: number;
  public currency!: string;
  public currencySymbol!: string;
  public pricePerKg!: number | null;
  public pricePerKm!: number | null;
  public pricePerMin!: number | null;
  public minimumFareUSD!: number;
  public scheduleRideCharges!: number;
  public baseFareUSD!: number;
  public commissionPercentage!: number;
  public userCancellationTimeLimit!: number;
  public userCancellationCharges!: number;
  public waitingTimeLimit!: number;
  public waitingChargesUSD!: number;
  public nightCharges!: boolean;
  public priceNightCharges!: number;
  public nightStartTime!: string;
  public nightEndTime!: string;
  public status!: 'active' | 'inactive';
  cityData?: ICityManagement;
  vehicleTypeData?: IVehicleTypes;
}

PriceManagement.init(
  {
    vehicleType: {
      type: DataTypes.NUMBER,
      references: {
        model: VehicleTypes,
        key: 'id',
      },
    },
    vehicleCategory: {
      type: DataTypes.NUMBER,
      references: {
        model: Category,
        key: 'id',
      },
    },
    country: {
      type: DataTypes.STRING,
    },
    state: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.NUMBER,
      references: {
        model: CityManagement,
        key: 'id',
      },
    },
    currency: {
      type: DataTypes.STRING,
    },
    currencySymbol: {
      type: DataTypes.STRING,
    },
    pricePerKg: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    pricePerKm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    pricePerMin: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    minimumFareUSD: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    baseFareUSD: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    commissionPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    scheduleRideCharges: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    userCancellationTimeLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userCancellationCharges: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    waitingTimeLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    waitingChargesUSD: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    nightCharges: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    priceNightCharges: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nightStartTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nightEndTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'PriceManagement',
    tableName: 'price_managements',
    timestamps: true,
  },
);

PriceManagement.belongsTo(VehicleTypes, {
  foreignKey: 'vehicleType',
  as: 'VehicleTypesData',
onDelete: 'CASCADE',  onUpdate: 'CASCADE'
});
PriceManagement.belongsTo(CityManagement, { foreignKey: 'city', as: 'cityData' ,onDelete: 'CASCADE',  onUpdate: 'CASCADE'});
PriceManagement.belongsTo(Category, { foreignKey: 'vehicleCategory', as: 'vehicleCategoryData' ,onDelete: 'CASCADE',  onUpdate: 'CASCADE'});

export default PriceManagement;
