import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import VehicleTypes, { IVehicleTypes } from './vehicleTypes.model';
import Users, { IUser } from './users.model';
import Vehicle, { IVehicle } from './vehicle.model';
import Coupons, { ICoupons } from './coupon.model';

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
  status:
    | 'pending'
    | 'driverAccepted'
    | 'booked'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'reminderSent'
    | 'scheduled'
    | 'finishTrip';
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
  originLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  isScheduled?: boolean;
  otpVerfied?: boolean;
  customerFeedBack: [{ question: string; keyword: string; rate: number }];
  driverFeedBack: [{ question: string; keyword: string; rate: number }];
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

class Ride extends Model implements IRide {
  public id!: number;
  public origin!: string;
  public rideId!: string;
  public destination!: string;
  public numberOfPassengers!: number;
  public date!: Date;
  public passengerId!: number;
  public vehicleId!: number;
  public driverId!: number;
  public fare!: number;
  public currencyCode!: string;
  public currencySymbol!: string;
  public status!:
    | 'pending'
    | 'driverAccepted'
    | 'booked'
    | 'reminderSent'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'scheduled'
    | 'finishTrip';
  public vehicleType!: number;
  public distanceInkm!: number;
  public durationInmins!: number;
  public paymentMethod!: string;
  public pickupTime!: Date;
  public dropOffTime!: Date;
  public notes?: string;
  public customerRating?: number;
  public driverRating?: number;
  public cancellationReason?: string;
  public driverAcceptStatus?: string;
  public passengersTextInstructions?: string;
  public passengersAudioInstructions?: string;
  public originLocation!: { lat: number; lng: number };
  public destinationLocation!: { lat: number; lng: number };
  public isScheduled?: boolean;
  public otpVerfied?: boolean;
  passenger?: IUser;
  public customerFeedBack!: [{ question: string; keyword: string; rate: number }];
  public driverFeedBack!: [{ question: string; keyword: string; rate: number }];
  public customerComment!: string;
  public driverComment!: string;
  public finalAmount!: number;
  public coupon!: number;
  public paymentSuccessful!: boolean;
  public paymentStatus!: string;
  public driversTip!: string;
  public driverCommissionPer!: number;
  public driverCommissionAmount!: number;
  public isNotified!: boolean;
  public mapScreenshot!: string;
  public file!: string;
}

Ride.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    rideId: {
      type: DataTypes.STRING,
    },
    passengerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Users,
        key: 'id',
      },
    },
    driverId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Users,
        key: 'id',
      },
    },
    vehicleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Vehicle,
        key: 'id',
      },
    },
    numberOfPassengers: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    fare: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    currencyCode: {
      type: DataTypes.STRING,
    },
    currencySymbol: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM(
        'pending',
        'driverAccepted',
        'booked',
        'in_progress',
        'completed',
        'cancelled',
        'scheduled',
        'reminderSent',
        'finishTrip',
      ),
      allowNull: false,
    },
    vehicleType: {
      type: DataTypes.NUMBER,
      allowNull: true,
      references: {
        model: VehicleTypes,
        key: 'id',
      },
    },
    distanceInkm: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    durationInmins: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pickupTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dropOffTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customerRating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
    },
    driverRating: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    driverAcceptStatus: {
      type: DataTypes.STRING,
    },
    passengersAudioInstructions: {
      type: DataTypes.STRING,
    },
    passengersTextInstructions: {
      type: DataTypes.STRING,
    },
    originLocation: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    destinationLocation: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isScheduled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    otpVerfied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customerFeedBack: {
      type: DataTypes.JSON,
    },
    customerComment: {
      type: DataTypes.STRING,
    },
    driverComment: {
      type: DataTypes.STRING,
    },
    driverFeedBack: {
      type: DataTypes.JSON,
    },
    coupon: {
      type: DataTypes.NUMBER,
      references: {
        model: Coupons,
        key: 'id',
      },
    },
    finalAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    paymentSuccessful: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paymentStatus: {
      type: DataTypes.STRING,
    },
    driversTip: {
      type: DataTypes.FLOAT,
    },
    driverCommissionPer: {
      type: DataTypes.FLOAT,
    },
    driverCommissionAmount: {
      type: DataTypes.FLOAT,
    },
    isNotified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    mapScreenshot: {
      type: DataTypes.STRING,
    },
    file: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: true,
  },
);

Ride.belongsTo(VehicleTypes, {
  foreignKey: 'vehicleType',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Ride.belongsTo(Vehicle, {
  foreignKey: 'vehicleId',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Ride.belongsTo(Coupons, {
  foreignKey: 'coupon',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Ride.belongsTo(Users, {
  as: 'passenger',
  foreignKey: 'passengerId',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
Ride.belongsTo(Users, {
  as: 'driver',
  foreignKey: 'driverId',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default Ride;
