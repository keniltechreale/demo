/// <reference types="node" />
import Rides, { IRide } from '../../models/rides.model';
import { ISearch } from '../../lib/common.interface';
import { IUser } from '../../models/users.model';
declare const _default: {
    addRides(args: Record<string, unknown>, user: IUser): Promise<{
        message: string;
        rides: IRide;
    }>;
    getRides(arg: ISearch, user: IUser): Promise<{
        message: string;
        page: number;
        perPage: number;
        totalCount: number;
        totalPage: number;
        rides: Rides[];
    }>;
    getRidesById(args: Record<string, string>, user: IUser): Promise<{
        message: string;
        rides: IRide;
        otp: string;
    }>;
    updateRides(args: Record<string, unknown>, rideId: string): Promise<{
        message: string;
        rides: IRide;
    }>;
    deleteRides(args: Record<string, unknown>, user: IUser): Promise<{
        message: string;
    }>;
    updateCountry(): Promise<{
        message: string;
    }>;
    addCountry(): Promise<{
        message: string;
    }>;
    downloadRidePdf(rideId: string, user: IUser): Promise<Buffer>;
};
export default _default;
