import { IVehicle } from '../../models/vehicle.model';
import Users, { IUser } from '../../models/users.model';
import Rides from '../../models/rides.model';
import { ISearch } from '../../lib/common.interface';
import { ITransaction } from '../../models/transaction.model';
declare const _default: {
    addDriver(args: Record<string, unknown>): Promise<{
        message: string;
        user: IUser;
    }>;
    userCount(): Promise<{
        message: string;
        driver: number;
        customer: number;
        rides: {
            total: number;
        };
        vehicleType: number;
        revenue: number;
        rideStatistics: Rides[];
    }>;
    userList(args: ISearch, role: string): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        users: {
            wallet_amount: number;
            wallet_currency: string;
            ratings: string;
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
            role: "customer" | "driver";
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
        }[];
    }>;
    userDetails(args: Record<string, string | Date | number | object>): Promise<{
        message: string;
        users: IUser;
        vehicle: IVehicle;
    }>;
    updateVehicle(args: Record<string, unknown>, vehicleId: string): Promise<{
        message: string;
        vehicle: IVehicle;
    }>;
    updateUser(args: Record<string, unknown>, userId: string): Promise<{
        message: string;
        user: Users;
    }>;
    viewVehicle(user_id: string): Promise<{
        message: string;
        vehicle: IVehicle;
    }>;
    getPaymentHistory(query: ISearch, userId: string): Promise<{
        message: string;
        transactions: ITransaction[];
    }>;
    deleteUser(args: Record<string, unknown>): Promise<{
        message: string;
    }>;
};
export default _default;
