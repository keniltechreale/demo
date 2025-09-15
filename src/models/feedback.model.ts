import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IFeedbacks {
  id: number;
  question: string;
  keywords: number[];
  role: 'customer' | 'driver';
  status: 'active' | 'inactive';
}

class Feedbacks extends Model implements IFeedbacks {
  public id!: number;
  public question!: string;
  public keywords!: number[];
  public status!: 'active' | 'inactive';
  public role!: 'customer' | 'driver';
}
Feedbacks.init(
  {
    question: {
      type: DataTypes.STRING,
    },
    keywords: {
      type: DataTypes.ARRAY(DataTypes.NUMBER),
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
    role: {
      type: DataTypes.ENUM('customer', 'driver'),
    },
  },
  {
    sequelize,
    modelName: 'Feedbacks',
    tableName: 'feedbacks',
    timestamps: true,
  },
);

export default Feedbacks;
