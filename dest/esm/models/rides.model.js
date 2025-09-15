import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/db.utils';
import VehicleTypes from './vehicleTypes.model';
import Users from './users.model';
import Vehicle from './vehicle.model';
import Coupons from './coupon.model';
class Ride extends Model {
}
Ride.init({
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
        type: DataTypes.ENUM('pending', 'driverAccepted', 'booked', 'in_progress', 'completed', 'cancelled', 'scheduled', 'reminderSent', 'finishTrip'),
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
}, {
    sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: true,
});
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
//# sourceMappingURL=rides.model.js.map