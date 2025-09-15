import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

export interface IContactUs {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  replied: boolean;
  replyContent: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class ContactUs extends Model<IContactUs> implements IContactUs {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone_number!: string;
  public message!: string;
  public replied!: boolean;
  public replyContent!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContactUs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    replied: { type: DataTypes.STRING },
    replyContent: { type: DataTypes.STRING },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'ContactUs',
    tableName: 'contact_us',
    timestamps: true,
  },
);

export default ContactUs;
