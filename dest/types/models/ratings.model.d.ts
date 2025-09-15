import { Model } from 'sequelize';
import { IUser } from './users.model';
/**
 * @swagger
 * components:
 *   schemas:
 *     Rating:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the rating.
 *           example: "60b9d13a12b7f70001f65b15"
 *         type:
 *           type: string
 *           description: The type of rating (e.g., product, service, delivery, etc.).
 *           example: "product"
 *         reason:
 *           type: string
 *           description: The reason for the rating.
 *           example: "Excellent service!"
 *         stars:
 *           type: number
 *           description: The rating stars out of 5.
 *           example: 4
 */
export interface IRating {
    id: number;
    user: number;
    driver: number;
    ride: number;
    type: string;
    reason: string;
    stars: number;
    User?: IUser;
}
declare class Rating extends Model implements IRating {
    id: number;
    user: number;
    driver: number;
    ride: number;
    type: string;
    reason: string;
    stars: number;
}
export default Rating;
