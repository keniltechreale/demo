import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface ICareerApplications {
  id: number;
  career_id: number;
  name: string;
  email: string;
  phone_number?: string;
  message?: string;
  resume: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

class CareerApplications extends Model<ICareerApplications> implements ICareerApplications {
  public id!: number;
  public career_id!: number;
  public name!: string;
  public email!: string;
  public phone_number!: string;
  public message!: string;
  public resume!: string;
  public status!: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'hired';
}

CareerApplications.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    career_id: {
      type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    resume: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired'),
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'CareerApplications',
    tableName: 'career_applications',
    timestamps: true,
  },
);

export default CareerApplications;
