"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_utils_1 = require("../lib/db.utils");
const vehicleTypes_model_1 = __importDefault(require("./vehicleTypes.model"));
const users_model_1 = __importDefault(require("./users.model"));
const vehicle_model_1 = __importDefault(require("./vehicle.model"));
const coupon_model_1 = __importDefault(require("./coupon.model"));
class Ride extends sequelize_1.Model {
}
Ride.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
    },
    origin: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    destination: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    rideId: {
        type: sequelize_1.DataTypes.STRING,
    },
    passengerId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    driverId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: users_model_1.default,
            key: 'id',
        },
    },
    vehicleId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: vehicle_model_1.default,
            key: 'id',
        },
    },
    numberOfPassengers: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    fare: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    currencyCode: {
        type: sequelize_1.DataTypes.STRING,
    },
    currencySymbol: {
        type: sequelize_1.DataTypes.STRING,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'driverAccepted', 'booked', 'in_progress', 'completed', 'cancelled', 'scheduled', 'reminderSent', 'finishTrip'),
        allowNull: false,
    },
    vehicleType: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: true,
        references: {
            model: vehicleTypes_model_1.default,
            key: 'id',
        },
    },
    distanceInkm: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    durationInmins: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pickupTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    dropOffTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    notes: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    customerRating: {
        type: sequelize_1.DataTypes.DECIMAL(3, 1),
        allowNull: true,
    },
    driverRating: {
        type: sequelize_1.DataTypes.DECIMAL(3, 1),
        allowNull: true,
    },
    cancellationReason: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    driverAcceptStatus: {
        type: sequelize_1.DataTypes.STRING,
    },
    passengersAudioInstructions: {
        type: sequelize_1.DataTypes.STRING,
    },
    passengersTextInstructions: {
        type: sequelize_1.DataTypes.STRING,
    },
    originLocation: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    destinationLocation: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    isScheduled: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    otpVerfied: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    customerFeedBack: {
        type: sequelize_1.DataTypes.JSON,
    },
    customerComment: {
        type: sequelize_1.DataTypes.STRING,
    },
    driverComment: {
        type: sequelize_1.DataTypes.STRING,
    },
    driverFeedBack: {
        type: sequelize_1.DataTypes.JSON,
    },
    coupon: {
        type: sequelize_1.DataTypes.NUMBER,
        references: {
            model: coupon_model_1.default,
            key: 'id',
        },
    },
    finalAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    paymentSuccessful: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.STRING,
    },
    driversTip: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    driverCommissionPer: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    driverCommissionAmount: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    isNotified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    mapScreenshot: {
        type: sequelize_1.DataTypes.STRING,
    },
    file: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: db_utils_1.sequelize,
    modelName: 'Ride',
    tableName: 'rides',
    timestamps: true,
});
Ride.belongsTo(vehicleTypes_model_1.default, {
    foreignKey: 'vehicleType',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Ride.belongsTo(vehicle_model_1.default, {
    foreignKey: 'vehicleId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Ride.belongsTo(coupon_model_1.default, {
    foreignKey: 'coupon',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Ride.belongsTo(users_model_1.default, {
    as: 'passenger',
    foreignKey: 'passengerId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Ride.belongsTo(users_model_1.default, {
    as: 'driver',
    foreignKey: 'driverId',
    targetKey: 'id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
exports.default = Ride;
//# sourceMappingURL=rides.model.js.map