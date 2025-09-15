import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import Users from './users.model';

export interface IEmergencyContact {
  id: number;
  user_id: number;
  contact_name: string;
  isoCode: string;
  relationship?: string;
  country_code: string;
  phone_number: string;
  email?: string;
  verified: boolean;
}

class EmergencyContact extends Model<IEmergencyContact> implements IEmergencyContact {
  public id!: number;
  public user_id!: number;
  public contact_name!: string;
  public relationship!: string;
  public isoCode!: string;
  public country_code!: string;
  public phone_number!: string;
  public email?: string;
  public verified: boolean;
}

EmergencyContact.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.NUMBER,
      allowNull: false,
      references: {
        model: Users,
        key: 'id',
      },
    },
    isoCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'EmergencyContact',
    tableName: 'emergency_contacts',
    timestamps: true,
  },
);

EmergencyContact.belongsTo(Users, { foreignKey: 'user_id', targetKey: 'id',onDelete: 'CASCADE',  onUpdate: 'CASCADE' });

export default EmergencyContact;
