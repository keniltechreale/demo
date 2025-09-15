import { ILocation } from '../../models/userlocation.model';
import { IVehicle } from '../../models/vehicle.model';
import { IDocument } from '../../models/documents.model';
import { ISearch } from '../../lib/common.interface';
import { IUser } from '../../models/users.model';
import { IRide } from '../../models/rides.model';
interface WeekData {
    date: string;
    earnings: number;
    trips: number;
    tips: number;
    totalAmount: number;
}
declare const _default: {
    getDocuments(args: ISearch, city: string): Promise<{
        message: string;
        documents: IDocument[];
    }>;
    dashboard(userId: number): Promise<{
        message: string;
        todayEaring: number;
        location: ILocation;
        isDocumentsVerified: boolean;
        vehicle: IVehicle;
        users: IUser;
    }>;
    ChangeConnectionStatus(args: Record<string, unknown>, userId: number): Promise<{
        message: string;
        location: ILocation;
    }>;
    rideRequest(driverId: number, rideId: string, type: string): Promise<{
        message: string;
    }>;
    verifyRideOtp(args: Record<string, string>, rideId: string, userId: number): Promise<{
        message: string;
    }>;
    viewCustomerInstructions(rideId: string): Promise<{
        message: string;
        data: IRide;
    }>;
    getStatistics(driverId: number): Promise<{
        weekData: WeekData[];
        weeklyTotalEarnings: number;
        weeklyTotalTrips: number;
        weeklyTotalTips: number;
        totalEarnings: number;
        totalTrips: number;
        totalTips: number;
        totalTime: {
            hours: number;
            minutes: number;
        };
        averageTime: {
            hours: number;
            minutes: number;
        };
        commissionPercentage: number;
    }>;
    distanceCount(args: Record<string, unknown>, rideId: string): Promise<{
        message: string;
        distance: {
            distanceInkm: number;
            durationInmins: number;
        };
    }>;
};
export default _default;
