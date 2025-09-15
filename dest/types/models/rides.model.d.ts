import { Model } from 'sequelize';
import { IVehicleTypes } from './vehicleTypes.model';
import { IUser } from './users.model';
import { IVehicle } from './vehicle.model';
import { ICoupons } from './coupon.model';
/**
 * @swagger
 * components:
 *   schemas:
 *     Ride:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the ride.
 *           example: 1
 *         origin:
 *           type: string
 *           description: The starting point of the ride.
 *           example: "123 Main St, Anytown, USA"
 *         destination:
 *           type: string
 *           description: The destination of the ride.
 *           example: "456 Elm St, Othertown, USA"
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time when the ride is booked.
 *           example: "2024-05-20T13:45:00Z"
 *         passengerId:
 *           type: integer
 *           description: A reference to the passenger who booked the ride.
 *           example: 101
 *         driverId:
 *           type: integer
 *           description: A reference to the driver assigned to the ride.
 *           example: 202
 *         fare:
 *           type: number
 *           description: The cost of the ride.
 *           example: 25.50
 *         status:
 *           type: string
 *           description: The status of the ride.
 *           enum: [ "booked", "in_progress", "completed", "cancelled" ]
 *           example: "booked"
 *         vehicleType:
 *           type: string
 *           description: The type of vehicle.
 *           enum: [ "sedan", "SUV", "bike" ]
 *           example: "sedan"
 *         distance:
 *           type: number
 *           description: The distance of the ride (in kilometers or miles).
 *           example: 12.5
 *         duration:
 *           type: integer
 *           description: The estimated duration of the ride (in minutes).
 *           example: 30
 *         paymentMethod:
 *           type: string
 *           description: The payment method used for the ride.
 *           example: "credit_card"
 *         pickupTime:
 *           type: string
 *           format: date-time
 *           description: The estimated pickup time for the ride.
 *           example: "2024-05-20T14:00:00Z"
 *         notes:
 *           type: string
 *           description: Any additional notes or special instructions related to the ride.
 *           example: "Pickup at the back entrance."
 *         rating:
 *           type: integer
 *           description: Rating given by the passenger.
 *           example: 5
 *         driverRating:
 *           type: integer
 *           description: Rating given by the driver.
 *           example: 4
 *         cancellationReason:
 *           type: string
 *           description: The reason for cancellation if the ride is cancelled.
 *           example: "no-show"
 */
export interface IRide {
    id: number;
    origin: string;
    destination: string;
    date: Date;
    rideId: string;
    passengerId: number;
    vehicleId: number;
    driverId: number;
    fare: number;
    currencyCode: string;
    currencySymbol: string;
    numberOfPassengers: number;
    status: 'pending' | 'driverAccepted' | 'booked' | 'in_progress' | 'completed' | 'cancelled' | 'reminderSent' | 'scheduled' | 'finishTrip';
    vehicleType: number;
    distanceInkm: number;
    durationInmins: number;
    paymentMethod: string;
    pickupTime: Date;
    dropOffTime: Date;
    notes?: string;
    customerRating?: number;
    driverRating?: number;
    cancellationReason?: string;
    User?: IUser;
    Vehicle?: IVehicle;
    passengersTextInstructions?: string;
    passengersAudioInstructions?: string;
    VehicleType?: IVehicleTypes;
    driverAcceptStatus?: string;
    passenger?: IUser;
    count?: number;
    originLocation: {
        lat: number;
        lng: number;
    };
    destinationLocation: {
        lat: number;
        lng: number;
    };
    isScheduled?: boolean;
    otpVerfied?: boolean;
    customerFeedBack: [{
        question: string;
        keyword: string;
        rate: number;
    }];
    driverFeedBack: [{
        question: string;
        keyword: string;
        rate: number;
    }];
    customerComment: string;
    driverComment: string;
    coupon: number;
    finalAmount: number;
    paymentSuccessful: boolean;
    paymentStatus: string;
    driversTip: string;
    driverCommissionPer: number;
    driverCommissionAmount: number;
    driver?: IUser;
    createdAt?: Date;
    updatedAt?: Date;
    Coupon?: ICoupons;
    mapScreenshot: string;
    file: string;
}
declare class Ride extends Model implements IRide {
    id: number;
    origin: string;
    rideId: string;
    destination: string;
    numberOfPassengers: number;
    date: Date;
    passengerId: number;
    vehicleId: number;
    driverId: number;
    fare: number;
    currencyCode: string;
    currencySymbol: string;
    status: 'pending' | 'driverAccepted' | 'booked' | 'reminderSent' | 'in_progress' | 'completed' | 'cancelled' | 'scheduled' | 'finishTrip';
    vehicleType: number;
    distanceInkm: number;
    durationInmins: number;
    paymentMethod: string;
    pickupTime: Date;
    dropOffTime: Date;
    notes?: string;
    customerRating?: number;
    driverRating?: number;
    cancellationReason?: string;
    driverAcceptStatus?: string;
    passengersTextInstructions?: string;
    passengersAudioInstructions?: string;
    originLocation: {
        lat: number;
        lng: number;
    };
    destinationLocation: {
        lat: number;
        lng: number;
    };
    isScheduled?: boolean;
    otpVerfied?: boolean;
    passenger?: IUser;
    customerFeedBack: [{
        question: string;
        keyword: string;
        rate: number;
    }];
    driverFeedBack: [{
        question: string;
        keyword: string;
        rate: number;
    }];
    customerComment: string;
    driverComment: string;
    finalAmount: number;
    coupon: number;
    paymentSuccessful: boolean;
    paymentStatus: string;
    driversTip: string;
    driverCommissionPer: number;
    driverCommissionAmount: number;
    isNotified: boolean;
    mapScreenshot: string;
    file: string;
}
export default Ride;
