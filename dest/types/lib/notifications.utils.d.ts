import { IUser } from '../models/users.model';
export interface NotificationData {
    title: string;
    body: string;
    type?: string;
    data?: {
        [key: string]: any;
    };
}
export declare const sendNotification: (app: any, user: IUser, payload: NotificationData) => Promise<void>;
export declare const sendDriverNotification: (user: IUser, payload: NotificationData) => Promise<void>;
export declare const sendCustomerNotification: (user: IUser, payload: NotificationData) => Promise<void>;
