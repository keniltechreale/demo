import Rides, { IRide } from '../../models/rides.model';
import { ISearch } from '../../lib/common.interface';
declare const _default: {
    updateRides(args: Record<string, unknown>, orderId: string): Promise<{
        message: string;
        rides: IRide;
    }>;
    getRides(rideId: string): Promise<{
        message: string;
        rides: IRide;
    }>;
    getAllRides(arg: ISearch): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        rides: Rides[];
    }>;
    getHistoryRides(arg: ISearch, userId: string, role: string): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        rides: Rides[];
    }>;
};
export default _default;
