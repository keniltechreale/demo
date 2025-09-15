import { Model } from 'sequelize';
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
declare class Users extends Model implements IUser {
    id: number;
    user_id: string;
    name: string;
    email: string;
    country_code: string;
    country: string;
    state: string;
    city: string;
    address: string;
    date_of_birth: Date;
    phone_number: string;
    region: string;
    referral_code: string;
    password: string;
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
export default Users;
