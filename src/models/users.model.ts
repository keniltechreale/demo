import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';

/**
 * @swagger
 *components:
 *  schemas:
 *    UserSchema:
 *      type: object
 *      properties:
 *        user_id:
 *          type: string
 *          description: The unique identifier of the user.
 *        full_name:
 *          type: string
 *          description: The full name of the user.
 *        email:
 *          type: string
 *          format: email
 *          description: The email address of the user.
 *        phone_number:
 *          type: string
 *          description: The phone number of the user.
 *        country_code:
 *          type: string
 *          description: The country code of the user's phone number.
 *        referral_code:
 *          type: string
 *          description: The referral code of the user.
 *        password:
 *          type: string
 *          description: The password (Mobile Personal Identification Number) of the user.
 *        verify_account:
 *          type: boolean
 *          description: Indicates whether the user's account is verified or not.
 *        password_created:
 *          type: boolean
 *          description: Indicates whether the user has created an password or not.
 *        biometric_lock:
 *          type: boolean
 *          description: Indicates whether the user has enabled biometric lock or not.
 *        role:
 *          type: string
 *          enum:
 *            - customer
 *            - driver
 *          description: The role of the user.
 *        profile_picture:
 *          type: string
 *          description: URL to the user's profile photo.
 *        isBusinessAccount:
 *          type: boolean
 *          description: Indicates whether the user has a business account or not.
 *        status:
 *          type: string
 *          enum:
 *            - active
 *            - inactive
 *          description: The status of the user's account.
 *        registeredBy:
 *          type: string
 *          enum:
 *            - self
 *            - admin
 *          description: Indicates whether the user registered themselves or was registered by an admin.
 *        registerWith:
 *          type: string
 *          enum:
 *            - social
 *            - goparcel
 *          description: Indicates how the user registered.
 *        socialRegisterWith:
 *          type: string
 *          enum:
 *            - google
 *            - facebook
 *            - whatsapp
 *            - apple
 *          description: Indicates which social platform the user registered with (if applicable).
 *      required:
 *        - full_name
 *        - email
 *        - role
 */

export interface IUser {
  id: number;
  userId?: number;
  user_id: string;
  name: string;
  email: string;
  country_code: string;
  phone_number: string;
  region: string;
  referral_code: string;
  password: string;
  country: string;
  state: string;
  city: string;
  date_of_birth: Date;
  address: string;
  pincode: string;
  role: 'customer' | 'driver';
  profile_picture: string;
  verify_account: boolean;
  biometric_lock: boolean;
  is_business_account: boolean;
  status: string;
  registered_by: string;
  register_with: string;
  social_register_with: string;
  apple_id: string;
  refer_friends_with: string;
  fcm_token: string;
  driver_available: {
    status: boolean;
    ride: string;
  };
  ongoing_rides: {
    status: boolean;
    ride: string;
  };
  is_driver_online: boolean;
  driver_vehicle_type: string;
  driver_vehicle_category: string;
  currency: string;
  deleted_at: Date;
}

class Users extends Model implements IUser {
  public id!: number;
  public user_id!: string;
  public name!: string;
  public email!: string;
  public country_code!: string;
  public country!: string;
  public state!: string;
  public city!: string;
  public address!: string;
  public date_of_birth!: Date;
  public phone_number!: string;
  public region!: string;
  public referral_code!: string;
  public password!: string;
  public pincode!: string;
  public role!: 'customer' | 'driver';
  public profile_picture!: string;
  public verify_account!: boolean;
  public biometric_lock!: boolean;
  public is_business_account!: boolean;
  public status!: string;
  public registered_by!: string;
  public register_with!: string;
  public social_register_with!: string;
  public apple_id!: string;
  public refer_friends_with!: string;
  public fcm_token!: string;
  public driver_available!: {
    status: boolean;
    ride: string;
  };
  public ongoing_rides!: {
    status: boolean;
    ride: string;
  };
  public is_driver_online!: boolean;
  public driver_vehicle_type!: string;
  public driver_vehicle_category!: string;
  public currency!: string;
  public deleted_at!: Date;
}

Users.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    referral_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('customer', 'driver'),
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verify_account: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    biometric_lock: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_business_account: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'deleted'),
      allowNull: false,
      defaultValue: 'active',
    },
    refer_friends_with: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fcm_token: {
      type: DataTypes.STRING,
    },
    driver_available: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ongoing_rides: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    is_driver_online: {
      type: DataTypes.BOOLEAN,
    },
    driver_vehicle_type: {
      type: DataTypes.STRING,
    },
    driver_vehicle_category: {
      type: DataTypes.STRING,
    },
    currency: {
      type: DataTypes.STRING,
    },
    deleted_at: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  },
);

export default Users;
