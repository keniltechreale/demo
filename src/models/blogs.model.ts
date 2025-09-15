import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IBlogs {
  id: number;
  image: string;
  title: string;
  author: string;
  author_image: string;
  subtitle: string;
  description: string;
  status: 'active' | 'inactive';
}

class Blogs extends Model<IBlogs> implements IBlogs {
  public id!: number;
  public image!: string;
  public title!: string;
  public author!: string;
  public author_image!: string;
  public subtitle!: string;
  public description!: string;
  public status!: 'active' | 'inactive';
}

Blogs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
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
    modelName: 'Blogs',
    tableName: 'blogs',
    timestamps: true,
  },
);

export default Blogs;
