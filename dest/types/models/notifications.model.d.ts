import { Model } from 'sequelize';
import { IRide } from './rides.model';
import { ICashoutRequests } from './cashoutRequest.model';
export interface INotification {
    id: number;
    user: number;
    admin: number;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    meta_data: {
        ride?: number;
        rideDetails?: IRide;
        cashouRequestId?: number;
        cashoutRequestDetails?: ICashoutRequests;
        user?: number;
    };
}
declare class Notification extends Model<INotification> implements INotification {
    id: number;
    user: number;
    admin: number;
    type: string;
    title: string;
    body: string;
    isRead: boolean;
    meta_data: object;
}
export default Notification;
