import { Model } from 'sequelize';
/**
 * @swagger
 * components:
 *   schemas:
 *     UserAddress:
 *       type: object
 *       required:
 *         - user
 *         - latitude
 *         - longitude
 *       properties:
 *         is:
 *           type: string
 *           description: The ID of the user.
 *         type:
 *           type: string
 *           description: The latitude coordinate of the location.
 *         name:
 *           type: string
 *           description: The longitude coordinate of the location.
 *         pin_code:
 *           type: string
 *           description: The ID of the user.
 *         mobile_number:
 *           type: string
 *           description: The ID of the user.
 *
 */
export interface IAddress {
    id: number;
    user: string;
    type: string;
    name: string;
    address: string;
    pin_code: string;
    mobile_number: string;
}
declare class UserAddress extends Model implements IAddress {
    id: number;
    user: string;
    type: string;
    name: string;
    address: string;
    pin_code: string;
    mobile_number: string;
}
export default UserAddress;
