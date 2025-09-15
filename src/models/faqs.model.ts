import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IFAQs {
  id: number;
  question: string;
  answer: string;
  serial_number: number;
  status: 'active' | 'inactive';
}

class FAQs extends Model implements IFAQs {
  public id!: number;
  public question!: string;
  public answer!: string;
  public serial_number!: number;
  public status!: 'active' | 'inactive';
}

FAQs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'FAQs',
    tableName: 'faqs',
    timestamps: true,
  },
);

export default FAQs;
