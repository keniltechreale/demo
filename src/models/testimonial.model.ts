import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface ITestimonials {
  id: number;
  image: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

class Testimonials extends Model<ITestimonials> implements ITestimonials {
  public id!: number;
  public image!: string;
  public name!: string;
  public description!: string;
  public status!: 'active' | 'inactive';
}

Testimonials.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    sequelize,
    modelName: 'Testimonials',
    tableName: 'testimonials',
    timestamps: true,
  },
);

export default Testimonials;
