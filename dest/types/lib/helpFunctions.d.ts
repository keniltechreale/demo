import { IUser } from '../models/users.model';
import { IRide } from '../models/rides.model';
export declare function generateUniqueID(region: string): Promise<string>;
export declare function generateReferCode(): string;
export declare function generateUniqueRidesId(): string;
export declare function calculateAmount(vehicleType: number, city: string, distance: number): Promise<{
    totalAmount: number;
    currency: string;
    currencySymbol: string;
}>;
export declare function deleteDriverRelatedData(user: IUser): Promise<string>;
export declare function generateUniqueCouponCode(): string;
export declare const generateTransactionRef: (length: number) => string;
export declare function convertDecimalHoursToTime(decimalHours: number): {
    hours: number;
    minutes: number;
};
export declare function getTodayEarnings(userId: number): Promise<number>;
export declare function rideCompletion(ridesDetails: IRide): Promise<void>;
