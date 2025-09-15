import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Categories from './category.model';

export interface ICareer {
  id: number;
  title: string;
  role: string;
  description: string;
  location: string;
  requirements: string[];
  salaryRange?: string;
  postedDate: Date;
}

class Career extends Model implements ICareer {
  public id!: number;
  public role!: string;
  public title!: string;
  public description!: string;
  public location!: string;
  public requirements!: string[];
  public salaryRange?: string;
  public postedDate!: Date;
  public category!: string;
}

Career.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requirements: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    salaryRange: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Categories,
        key: 'id',
      },
    },
    postedDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Career',
    tableName: 'careers',
    timestamps: false,
  },
);

Career.belongsTo(Categories, { foreignKey: 'category', targetKey: 'id' });

export default Career;
