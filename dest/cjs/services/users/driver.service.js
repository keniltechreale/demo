"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userlocation_model_1 = __importDefault(require("../../models/userlocation.model"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
const constants_1 = require("../../lib/constants");
const documents_model_1 = __importDefault(require("../../models/documents.model"));
const citymanagement_model_1 = __importDefault(require("../../models/citymanagement.model"));
const sequelize_1 = require("sequelize");
const Utils = __importStar(require("../../lib/utils"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const server_1 = require("../../server");
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const vehicleTypes_model_2 = __importDefault(require("../../models/vehicleTypes.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const ratings_model_1 = __importDefault(require("../../models/ratings.model"));
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const date_fns_1 = require("date-fns");
const helpFunctions_1 = require("../../lib/helpFunctions");
const pricemanagement_model_1 = __importDefault(require("../../models/pricemanagement.model"));
const google_utils_1 = require("../../lib/google.utils");
exports.default = new (class DriverService {
    getDocuments(args, city) {
        return __awaiter(this, void 0, void 0, function* () {
            let existCity;
            const vehicleType = parseInt(args.vehicleType);
            const documents = yield documents_model_1.default.findAll({
                where: { isRequired: true, status: true },
            });
            if (city) {
                existCity = yield citymanagement_model_1.default.findOne({
                    where: {
                        city: city,
                        status: 'active',
                        [sequelize_1.Op.and]: [(0, sequelize_1.literal)(`JSON_CONTAINS(vehicleTypes, '[${vehicleType}]')`)],
                    },
                });
            }
            const allDocuments = documents.filter((doc) => {
                const includesVehicleType = doc.vehicleTypes.includes(vehicleType);
                return includesVehicleType;
            });
            if (existCity) {
                const documentIds = existCity.documents;
                const filteredCityDocuments = yield documents_model_1.default.findAll({
                    where: {
                        id: documentIds,
                    },
                });
                allDocuments.push(...filteredCityDocuments);
            }
            return {
                message: constants_1.SuccessMsg.DRIVER.documents,
                documents: allDocuments,
            };
        });
    }
    dashboard(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayEaring = yield (0, helpFunctions_1.getTodayEarnings)(userId);
            console.log('todayEaring  --', todayEaring);
            const existVehicle = yield vehicle_model_1.default.findOne({
                where: { user: userId },
                include: [
                    {
                        model: vehicleTypes_model_2.default,
                    },
                    {
                        model: category_model_1.default,
                    },
                ],
            });
            let documents;
            if (existVehicle) {
                documents = Utils.docVerification(existVehicle.documents);
            }
            else {
                documents = { status: 'pending' };
            }
            const users = yield users_model_1.default.findByPk(userId);
            const location = yield userlocation_model_1.default.findOne({ where: { user: userId } });
            let isDocumentsVerified = false;
            if (documents.status === 'approved') {
                isDocumentsVerified = true;
            }
            return {
                message: constants_1.SuccessMsg.DRIVER.dashborad,
                todayEaring: todayEaring,
                location: location,
                isDocumentsVerified: isDocumentsVerified,
                vehicle: existVehicle,
                users: users,
            };
        });
    }
    ChangeConnectionStatus(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { showCard } = args, requestData = __rest(args, ["showCard"]);
            if (showCard) {
                yield vehicle_model_1.default.update({ showCard: false }, { where: { user: userId } });
            }
            if (requestData.status && requestData.latitude === '0' && requestData.longitude === '0') {
                Utils.throwError('Latitude Longitude are required');
            }
            const existVehicle = yield vehicle_model_1.default.findOne({
                where: { user: userId, verified: true },
            });
            if (!existVehicle) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLE.notVerified);
            }
            let existLocation = yield userlocation_model_1.default.findOne({ where: { user: userId } });
            if (requestData.status === true) {
                requestData.online_since = new Date();
            }
            if (existLocation) {
                yield userlocation_model_1.default.update(requestData, { where: { user: userId } });
                existLocation = yield userlocation_model_1.default.findOne({ where: { user: userId } });
            }
            else {
                existLocation = yield userlocation_model_1.default.create(Object.assign({ user: userId }, args));
            }
            let is_driver_online = false;
            if (args.status == true) {
                is_driver_online = true;
            }
            if (requestData.status === false && existLocation && existLocation.online_since) {
                const currentTime = new Date();
                const onlineDurationMs = currentTime.getTime() - existLocation.online_since.getTime();
                const onlineDurationHours = onlineDurationMs / (1000 * 3600);
                console.log('--------------onlineDurationMs', onlineDurationMs);
                const total_online_hours = (existLocation.total_online_hours || 0) + onlineDurationHours;
                const days_online = existLocation.days_online ? existLocation.days_online + 1 : 1;
                const average_daily_hours = total_online_hours / days_online;
                console.log('--------------total_online_hours', total_online_hours, days_online, average_daily_hours);
                yield userlocation_model_1.default.update({
                    total_online_hours: total_online_hours,
                    days_online: days_online,
                    average_daily_hours: average_daily_hours,
                }, { where: { user: userId } });
            }
            yield users_model_1.default.update({ is_driver_online: is_driver_online }, { where: { id: userId } });
            return {
                message: constants_1.SuccessMsg.DRIVER.ConnectionStatus,
                location: existLocation,
            };
        });
    }
    rideRequest(driverId, rideId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield rides_model_1.default.findOne({
                where: { id: rideId, driverAcceptStatus: 'pending' },
                attributes: [
                    'id',
                    'origin',
                    'destination',
                    'date',
                    'rideId',
                    'fare',
                    'numberOfPassengers',
                    'passengerId',
                    'isScheduled',
                ],
                raw: true,
            });
            console.log('-----ride', ride);
            if (!ride) {
                Utils.throwError('Ride not available for acceptance.');
            }
            const user = yield users_model_1.default.findOne({ where: { id: ride.passengerId } });
            if (type === 'accept') {
                const vehicleDetails = yield vehicle_model_1.default.findOne({
                    where: { user: driverId },
                    attributes: [
                        'id',
                        'type',
                        'vehicle_platenumber',
                        'vehicle_model',
                        'vehicle_color',
                        'documents',
                    ],
                });
                const vehiclePictures = vehicleDetails.documents
                    .filter((doc) => doc.name.includes('image'))
                    .flatMap((doc) => doc.url);
                const vehicle = {
                    user: vehicleDetails.user,
                    vehicle_platenumber: vehicleDetails.vehicle_platenumber,
                    vehicle_model: vehicleDetails.vehicle_model,
                    vehicle_color: vehicleDetails.vehicle_color,
                    pictures: vehiclePictures,
                };
                const vehicleCategory = yield vehicleTypes_model_1.default.findOne({
                    where: { id: vehicleDetails.type },
                    raw: true,
                });
                console.log('ride', ride);
                let status;
                if (ride.isScheduled) {
                    status = 'scheduled';
                }
                else {
                    status = 'driverAccepted';
                }
                console.log('status', status);
                yield rides_model_1.default.update({
                    driverAcceptStatus: 'accepted',
                    driverId: driverId,
                    status: status,
                    vehicleType: vehicleDetails.type,
                    vehicleId: vehicleDetails.id,
                }, { where: { id: parseInt(rideId) } });
                yield users_model_1.default.update({ driver_available: { status: false, ride: rideId } }, { where: { id: driverId } });
                yield users_model_1.default.update({
                    ongoing_rides: {
                        status: true,
                        ride: ride.id,
                    },
                }, { where: { id: user.id } });
                const driverdetails = yield users_model_1.default.findOne({
                    where: { id: driverId },
                    attributes: ['name', 'email', 'country_code', 'phone_number', 'profile_picture'],
                    raw: true,
                });
                const otp = Utils.generateOTP();
                const newOtp = yield otp_model_1.default.create({ type: 'pickup', ride: rideId, user: driverId, otp: otp });
                const ratingDetails = yield ratings_model_1.default.findAll({ where: { driver: driverId } });
                let totalStars = 0;
                ratingDetails.forEach((rating) => {
                    totalStars += Number(rating.stars);
                });
                const averageStars = ratingDetails.length > 0 ? totalStars / ratingDetails.length : 0;
                server_1.io.of('/customers').emit(`OrderRequest_${rideId}`, {
                    message: {
                        status: 'accept',
                        driverdetails,
                        ride,
                        vehicle,
                        vehicleCategory,
                        verificationOTP: newOtp.otp,
                        averageStars,
                    },
                });
                if (user.fcm_token) {
                    yield (0, notifications_utils_1.sendCustomerNotification)(user, {
                        title: `Rides Accepted`,
                        type: `ride_accepted`,
                        body: `Your ride request is accepted by ${driverdetails.name}`,
                        data: { ride: ride },
                    });
                }
                return {
                    message: constants_1.SuccessMsg.DRIVER.orderAccepted,
                };
            }
            else {
                server_1.io.of('/customers').emit(`OrderRequest_${rideId}`, {
                    message: {
                        status: 'decline',
                        message: `The Request is been declined by driver, search for better riders`,
                    },
                });
                if (user.fcm_token) {
                    yield (0, notifications_utils_1.sendCustomerNotification)(user, {
                        title: `Ride declined`,
                        type: `ride_declined`,
                        body: `The request for ride is been declined by a driver`,
                        data: { ride: ride },
                    });
                }
                return {
                    message: constants_1.SuccessMsg.DRIVER.orderDecline,
                };
            }
        });
    }
    verifyRideOtp(args, rideId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield rides_model_1.default.findOne({ where: { id: rideId } });
            if (ride.driverId !== userId) {
                Utils.throwError('Not correct Ride');
            }
            const otp = yield otp_model_1.default.findOne({
                where: { user: userId, ride: rideId, type: 'pickup', otp: args.otp },
            });
            if (!otp) {
                Utils.throwError(constants_1.ErrorMsg.USER.incorrectOtp);
            }
            else {
                yield otp_model_1.default.destroy({ where: { user: `${userId}`, type: 'pickup' } });
                yield rides_model_1.default.update({ status: 'in_progress', otpVerfied: true, pickupTime: new Date() }, { where: { id: rideId } });
                server_1.io.of('/customers').emit(`OrderRequest_${rideId}`, {
                    message: { status: 'success', otpVerify: true },
                });
                const passenger = yield users_model_1.default.findOne({ where: { id: ride.passengerId } });
                const driver = yield users_model_1.default.findOne({ where: { id: ride.driverId } });
                if (passenger.fcm_token) {
                    yield (0, notifications_utils_1.sendCustomerNotification)(passenger, {
                        title: `Otp Verified`,
                        type: `otp_verified`,
                        body: `Your ride otp is verified by ${driver.name}`,
                        data: { ride: ride },
                    });
                }
                if (driver.fcm_token) {
                    yield (0, notifications_utils_1.sendDriverNotification)(driver, {
                        title: `Otp Verified`,
                        type: `otp_verified`,
                        body: `Ride otp verified successfully`,
                        data: { ride: ride },
                    });
                }
                return {
                    message: constants_1.SuccessMsg.USER.verifyOtp,
                };
            }
        });
    }
    viewCustomerInstructions(rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield rides_model_1.default.findOne({
                where: { id: rideId },
                attributes: ['passengersTextInstructions', 'passengersAudioInstructions'],
                raw: true,
            });
            if (!ride) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            return {
                message: constants_1.SuccessMsg.RIDES.instructions,
                data: ride,
            };
        });
    }
    getStatistics(driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const startDate = (0, date_fns_1.startOfWeek)(today, { weekStartsOn: 1 });
            const endDate = (0, date_fns_1.endOfWeek)(today, { weekStartsOn: 1 });
            const weekData = (0, date_fns_1.eachDayOfInterval)({ start: startDate, end: endDate }).map((date) => ({
                date: (0, date_fns_1.format)(date, 'yyyy-MM-dd'),
                earnings: 0,
                trips: 0,
                tips: 0,
                totalAmount: 0,
            }));
            const weeklyTransactions = yield transaction_model_1.default.findAll({
                where: {
                    user: driverId,
                    type: {
                        [sequelize_1.Op.or]: ['wallet', 'tip', 'ride'],
                    },
                    transactionType: 'credit',
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                    status: 'success',
                },
                raw: true,
            });
            const totalTransactions = yield transaction_model_1.default.findAll({
                where: {
                    user: driverId,
                    type: {
                        [sequelize_1.Op.or]: ['wallet', 'tip', 'ride'],
                    },
                    transactionType: 'credit',
                    createdAt: {
                        [sequelize_1.Op.lte]: today,
                    },
                    status: 'success',
                },
                raw: true,
            });
            let weeklyTotalEarnings = 0;
            let weeklyTotalTrips = 0;
            let weeklyTotalTips = 0;
            weeklyTransactions.forEach((transaction) => {
                const transactionDate = (0, date_fns_1.format)(new Date(transaction.createdAt), 'yyyy-MM-dd');
                const dayData = weekData.find((day) => day.date === transactionDate);
                if (dayData) {
                    if (transaction.purpose === 'Ride Payment') {
                        dayData.earnings += Number(transaction.amount);
                        dayData.trips += 1;
                        dayData.totalAmount += Number(transaction.amount);
                        weeklyTotalEarnings += Number(transaction.amount);
                        weeklyTotalTrips += 1;
                    }
                    else if (transaction.purpose === 'Ride Tip Payment' || transaction.type === 'tip') {
                        dayData.tips += Number(transaction.amount);
                        dayData.totalAmount += Number(transaction.amount);
                        weeklyTotalTips += Number(transaction.amount);
                    }
                }
            });
            let totalEarnings = 0;
            let totalTrips = 0;
            let totalTips = 0;
            totalTransactions.forEach((transaction) => {
                if (transaction.purpose === 'Ride Payment') {
                    totalEarnings += Number(transaction.amount);
                    totalTrips += 1;
                }
                else if (transaction.purpose === 'Ride Tip Payment' || transaction.type === 'tip') {
                    totalTips += Number(transaction.amount);
                    totalEarnings += Number(transaction.amount);
                }
            });
            const userLocation = yield userlocation_model_1.default.findOne({ where: { user: driverId } });
            const totalTime = (0, helpFunctions_1.convertDecimalHoursToTime)(userLocation.total_online_hours);
            const averageTime = (0, helpFunctions_1.convertDecimalHoursToTime)(userLocation.average_daily_hours);
            const vehicleDetails = yield vehicle_model_1.default.findOne({
                where: { user: driverId },
                attributes: ['category', 'type'],
                raw: true,
            });
            const price = yield pricemanagement_model_1.default.findOne({
                where: { vehicleType: vehicleDetails.type, vehicleCategory: vehicleDetails.category },
                attributes: ['id', 'pricePerKm', 'pricePerMin', 'commissionPercentage'],
                raw: true,
            });
            const commissionPercentage = price.commissionPercentage;
            return {
                weekData,
                weeklyTotalEarnings,
                weeklyTotalTrips,
                weeklyTotalTips,
                totalEarnings,
                totalTrips,
                totalTips,
                totalTime,
                averageTime,
                commissionPercentage,
            };
        });
    }
    distanceCount(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('0-0-0', args, rideId);
            const ride = yield rides_model_1.default.findOne({ where: { id: rideId } });
            if (!ride) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            let rideLocation;
            if (ride.status === 'in_progress') {
                rideLocation = ride.destinationLocation;
            }
            else {
                rideLocation = ride.originLocation;
            }
            const distanceToOrigin = yield (0, google_utils_1.calculateDuration)({ lat: Number(args.latitude), lng: Number(args.longitude) }, rideLocation);
            return {
                message: constants_1.SuccessMsg.RIDES.distanceCount,
                distance: distanceToOrigin,
            };
        });
    }
})();
//# sourceMappingURL=driver.service.js.map