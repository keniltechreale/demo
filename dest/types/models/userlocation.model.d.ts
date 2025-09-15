import { Model } from 'sequelize';
import { IUser } from './users.model';
/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       required:
 *         - user
 *         - latitude
 *         - longitude
 *       properties:
 *         user:
 *           type: string
 *           description: The ID of the user.
 *         latitude:
 *           type: string
 *           description: The latitude coordinate of the location.
 *         longitude:
 *           type: string
 *           description: The longitude coordinate of the location.
 */
export interface ILocation {
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
}
declare class UserLocation extends Model implements ILocation {
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
}
export default UserLocation;
