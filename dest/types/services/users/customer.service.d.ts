import { IRide } from '../../models/rides.model';
import { IUser } from '../../models/users.model';
import { IVehicleTypes } from '../../models/vehicleTypes.model';
import { ICategory } from '../../models/category.model';
declare const _default: {
    ViewDashboard(args: {
        lat: number;
        long: number;
    }): Promise<{
        message: string;
        driversInRange: {
            vehicleType: string;
            dataValues: any;
            id: number;
            user: string;
            latitude: string;
            longitude: string;
            status: boolean;
            online_since: Date;
            total_online_hours: number;
            average_daily_hours: number;
            days_online: number;
            User?: IUser;
        }[];
    }>;
    AvailableVehicleCategories(rideId: string): Promise<{
        status: string;
        message: string;
        data: {
            ride: string;
            categoriesWithDrivers: {
                category: ICategory;
                vehicleType: IVehicleTypes;
                fare: number;
                finalAmount: number;
                driverIds: string[];
                distanceInkm: number;
                durationInmins: number;
            }[];
        };
    }>;
    selectDrivers(rideId: string, args: {
        driverIds: number[];
    }): Promise<{
        message: string;
    }>;
    addInstructions(args: Record<string, unknown>, rideId: string): Promise<{
        message: string;
    }>;
    verifyCoupon(args: Record<string, unknown>, rideId: string, type: string): Promise<{
        message: string;
        amount: number;
        ride: IRide;
    }>;
    redeemCoupons(args: Record<string, unknown>, rideId: string): Promise<{
        message: string;
        ride: IRide;
    }>;
};
export default _default;
