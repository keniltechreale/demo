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
import UserLocation from '../../models/userlocation.model';
import Vehicle from '../../models/vehicle.model';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Documents from '../../models/documents.model';
import CityManagement from '../../models/citymanagement.model';
import { Op, literal } from 'sequelize';
import * as Utils from '../../lib/utils';
import Users from '../../models/users.model';
import Rides from '../../models/rides.model';
import VehicleCategory from '../../models/vehicleTypes.model';
import { io } from '../../server';
import OTP from '../../models/otp.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
import VehicleTypes from '../../models/vehicleTypes.model';
import Category from '../../models/category.model';
import Ratings from '../../models/ratings.model';
import Transactions from '../../models/transaction.model';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { convertDecimalHoursToTime, getTodayEarnings } from '../../lib/helpFunctions';
import PriceManagement from '../../models/pricemanagement.model';
import { calculateDuration } from '../../lib/google.utils';
export default new (class DriverService {
    getDocuments(args, city) {
        return __awaiter(this, void 0, void 0, function* () {
            let existCity;
            const vehicleType = parseInt(args.vehicleType);
            const documents = yield Documents.findAll({
                where: { isRequired: true, status: true },
            });
            if (city) {
                existCity = yield CityManagement.findOne({
                    where: {
                        city: city,
                        status: 'active',
                        [Op.and]: [literal(`JSON_CONTAINS(vehicleTypes, '[${vehicleType}]')`)],
                    },
                });
            }
            const allDocuments = documents.filter((doc) => {
                const includesVehicleType = doc.vehicleTypes.includes(vehicleType);
                return includesVehicleType;
            });
            if (existCity) {
                const documentIds = existCity.documents;
                const filteredCityDocuments = yield Documents.findAll({
                    where: {
                        id: documentIds,
                    },
                });
                allDocuments.push(...filteredCityDocuments);
            }
            return {
                message: SuccessMsg.DRIVER.documents,
                documents: allDocuments,
            };
        });
    }
    dashboard(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayEaring = yield getTodayEarnings(userId);
            console.log('todayEaring  --', todayEaring);
            const existVehicle = yield Vehicle.findOne({
                where: { user: userId },
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Category,
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
            const users = yield Users.findByPk(userId);
            const location = yield UserLocation.findOne({ where: { user: userId } });
            let isDocumentsVerified = false;
            if (documents.status === 'approved') {
                isDocumentsVerified = true;
            }
            return {
                message: SuccessMsg.DRIVER.dashborad,
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
                yield Vehicle.update({ showCard: false }, { where: { user: userId } });
            }
            if (requestData.status && requestData.latitude === '0' && requestData.longitude === '0') {
                Utils.throwError('Latitude Longitude are required');
            }
            const existVehicle = yield Vehicle.findOne({
                where: { user: userId, verified: true },
            });
            if (!existVehicle) {
                Utils.throwError(ErrorMsg.VEHICLE.notVerified);
            }
            let existLocation = yield UserLocation.findOne({ where: { user: userId } });
            if (requestData.status === true) {
                requestData.online_since = new Date();
            }
            if (existLocation) {
                yield UserLocation.update(requestData, { where: { user: userId } });
                existLocation = yield UserLocation.findOne({ where: { user: userId } });
            }
            else {
                existLocation = yield UserLocation.create(Object.assign({ user: userId }, args));
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
                yield UserLocation.update({
                    total_online_hours: total_online_hours,
                    days_online: days_online,
                    average_daily_hours: average_daily_hours,
                }, { where: { user: userId } });
            }
            yield Users.update({ is_driver_online: is_driver_online }, { where: { id: userId } });
            return {
                message: SuccessMsg.DRIVER.ConnectionStatus,
                location: existLocation,
            };
        });
    }
    rideRequest(driverId, rideId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield Rides.findOne({
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
            const user = yield Users.findOne({ where: { id: ride.passengerId } });
            if (type === 'accept') {
                const vehicleDetails = yield Vehicle.findOne({
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
                const vehicleCategory = yield VehicleCategory.findOne({
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
                yield Rides.update({
                    driverAcceptStatus: 'accepted',
                    driverId: driverId,
                    status: status,
                    vehicleType: vehicleDetails.type,
                    vehicleId: vehicleDetails.id,
                }, { where: { id: parseInt(rideId) } });
                yield Users.update({ driver_available: { status: false, ride: rideId } }, { where: { id: driverId } });
                yield Users.update({
                    ongoing_rides: {
                        status: true,
                        ride: ride.id,
                    },
                }, { where: { id: user.id } });
                const driverdetails = yield Users.findOne({
                    where: { id: driverId },
                    attributes: ['name', 'email', 'country_code', 'phone_number', 'profile_picture'],
                    raw: true,
                });
                const otp = Utils.generateOTP();
                const newOtp = yield OTP.create({ type: 'pickup', ride: rideId, user: driverId, otp: otp });
                const ratingDetails = yield Ratings.findAll({ where: { driver: driverId } });
                let totalStars = 0;
                ratingDetails.forEach((rating) => {
                    totalStars += Number(rating.stars);
                });
                const averageStars = ratingDetails.length > 0 ? totalStars / ratingDetails.length : 0;
                io.of('/customers').emit(`OrderRequest_${rideId}`, {
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
                    yield sendCustomerNotification(user, {
                        title: `Rides Accepted`,
                        type: `ride_accepted`,
                        body: `Your ride request is accepted by ${driverdetails.name}`,
                        data: { ride: ride },
                    });
                }
                return {
                    message: SuccessMsg.DRIVER.orderAccepted,
                };
            }
            else {
                io.of('/customers').emit(`OrderRequest_${rideId}`, {
                    message: {
                        status: 'decline',
                        message: `The Request is been declined by driver, search for better riders`,
                    },
                });
                if (user.fcm_token) {
                    yield sendCustomerNotification(user, {
                        title: `Ride declined`,
                        type: `ride_declined`,
                        body: `The request for ride is been declined by a driver`,
                        data: { ride: ride },
                    });
                }
                return {
                    message: SuccessMsg.DRIVER.orderDecline,
                };
            }
        });
    }
    verifyRideOtp(args, rideId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield Rides.findOne({ where: { id: rideId } });
            if (ride.driverId !== userId) {
                Utils.throwError('Not correct Ride');
            }
            const otp = yield OTP.findOne({
                where: { user: userId, ride: rideId, type: 'pickup', otp: args.otp },
            });
            if (!otp) {
                Utils.throwError(ErrorMsg.USER.incorrectOtp);
            }
            else {
                yield OTP.destroy({ where: { user: `${userId}`, type: 'pickup' } });
                yield Rides.update({ status: 'in_progress', otpVerfied: true, pickupTime: new Date() }, { where: { id: rideId } });
                io.of('/customers').emit(`OrderRequest_${rideId}`, {
                    message: { status: 'success', otpVerify: true },
                });
                const passenger = yield Users.findOne({ where: { id: ride.passengerId } });
                const driver = yield Users.findOne({ where: { id: ride.driverId } });
                if (passenger.fcm_token) {
                    yield sendCustomerNotification(passenger, {
                        title: `Otp Verified`,
                        type: `otp_verified`,
                        body: `Your ride otp is verified by ${driver.name}`,
                        data: { ride: ride },
                    });
                }
                if (driver.fcm_token) {
                    yield sendDriverNotification(driver, {
                        title: `Otp Verified`,
                        type: `otp_verified`,
                        body: `Ride otp verified successfully`,
                        data: { ride: ride },
                    });
                }
                return {
                    message: SuccessMsg.USER.verifyOtp,
                };
            }
        });
    }
    viewCustomerInstructions(rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield Rides.findOne({
                where: { id: rideId },
                attributes: ['passengersTextInstructions', 'passengersAudioInstructions'],
                raw: true,
            });
            if (!ride) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            return {
                message: SuccessMsg.RIDES.instructions,
                data: ride,
            };
        });
    }
    getStatistics(driverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const startDate = startOfWeek(today, { weekStartsOn: 1 });
            const endDate = endOfWeek(today, { weekStartsOn: 1 });
            const weekData = eachDayOfInterval({ start: startDate, end: endDate }).map((date) => ({
                date: format(date, 'yyyy-MM-dd'),
                earnings: 0,
                trips: 0,
                tips: 0,
                totalAmount: 0,
            }));
            const weeklyTransactions = yield Transactions.findAll({
                where: {
                    user: driverId,
                    type: {
                        [Op.or]: ['wallet', 'tip', 'ride'],
                    },
                    transactionType: 'credit',
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                    status: 'success',
                },
                raw: true,
            });
            const totalTransactions = yield Transactions.findAll({
                where: {
                    user: driverId,
                    type: {
                        [Op.or]: ['wallet', 'tip', 'ride'],
                    },
                    transactionType: 'credit',
                    createdAt: {
                        [Op.lte]: today,
                    },
                    status: 'success',
                },
                raw: true,
            });
            let weeklyTotalEarnings = 0;
            let weeklyTotalTrips = 0;
            let weeklyTotalTips = 0;
            weeklyTransactions.forEach((transaction) => {
                const transactionDate = format(new Date(transaction.createdAt), 'yyyy-MM-dd');
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
            const userLocation = yield UserLocation.findOne({ where: { user: driverId } });
            const totalTime = convertDecimalHoursToTime(userLocation.total_online_hours);
            const averageTime = convertDecimalHoursToTime(userLocation.average_daily_hours);
            const vehicleDetails = yield Vehicle.findOne({
                where: { user: driverId },
                attributes: ['category', 'type'],
                raw: true,
            });
            const price = yield PriceManagement.findOne({
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
            const ride = yield Rides.findOne({ where: { id: rideId } });
            if (!ride) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            let rideLocation;
            if (ride.status === 'in_progress') {
                rideLocation = ride.destinationLocation;
            }
            else {
                rideLocation = ride.originLocation;
            }
            const distanceToOrigin = yield calculateDuration({ lat: Number(args.latitude), lng: Number(args.longitude) }, rideLocation);
            return {
                message: SuccessMsg.RIDES.distanceCount,
                distance: distanceToOrigin,
            };
        });
    }
})();
//# sourceMappingURL=driver.service.js.map