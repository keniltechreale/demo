import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import * as bcrypt from 'bcrypt';

export interface IAdminUser {
  id: number;
  name: string;
  email: string;
  password: string;
  last_login: Date;
}

class Admin extends Model implements IAdminUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public last_login!: Date;
}

const saltRounds = 10;

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      // autoIncrement: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
      set(this: Admin, value: string) {
        this.setDataValue('email', value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
      set(this: Admin, value: string) {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hashedPassword);
      },
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admin',
    timestamps: false,
  },
);

export default Admin;
