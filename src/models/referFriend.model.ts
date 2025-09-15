import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IReferFriendsSection {
  id: number;
  type: string;
  title: string;
  subTitle: string;
  code: string;
  description: string;
  walletAmount: number;
}

class ReferFriendsSection extends Model<IReferFriendsSection> implements IReferFriendsSection {
  public id!: number;
  public type!: string;
  public title!: string;
  public subTitle!: string;
  public code!: string;
  public description!: string;
  public walletAmount!: number;
}

ReferFriendsSection.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    walletAmount: {
      type: DataTypes.NUMBER,
    },
  },
  {
    sequelize,
    modelName: 'ReferFriendsSection',
    tableName: 'refer_friends_section',
    timestamps: true,
  },
);

export default ReferFriendsSection;
