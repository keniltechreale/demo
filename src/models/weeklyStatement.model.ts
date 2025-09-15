import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IWeeklyStatement {
  id: number;
  user: number;
  file: string;
  startDate: string;
  endDate: string;
}

class WeeklyStatement extends Model<IWeeklyStatement> implements IWeeklyStatement {
  public id!: number;
  public user!: number;
  public file!: string;
  public startDate!: string;
  public endDate!: string;
}

WeeklyStatement.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user: {
      type: DataTypes.NUMBER,
    },
    file: {
      type: DataTypes.STRING,
    },
    startDate: {
      type: DataTypes.STRING,
    },
    endDate: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'WeeklyStatement',
    tableName: 'weekly_statement',
    timestamps: true,
  },
);

export default WeeklyStatement;
