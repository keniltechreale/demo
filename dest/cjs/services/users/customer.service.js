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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userlocation_model_1 = __importDefault(require("../../models/userlocation.model"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const server_1 = require("../../server");
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const sequelize_1 = require("sequelize");
const category_model_1 = __importDefault(require("../../models/category.model"));
const pricemanagement_model_1 = __importDefault(require("../../models/pricemanagement.model"));
const google_utils_1 = require("../../lib/google.utils");
const notifications_utils_1 = require("../../lib/notifications.utils");
const coupon_model_1 = __importDefault(require("../../models/coupon.model"));
const AdditionalFees_1 = __importDefault(require("../../models/AdditionalFees"));
const refferal_model_1 = __importDefault(require("../../models/refferal.model"));
exports.default = new (class CustomerService {
    ViewDashboard(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const distanceInKm = 100;
            const rideLatitude = args.lat;
            const rideLongitude = args.long;
            const driversInRange = yield userlocation_model_1.default.findAll({
                where: {
                    status: true,
                    [sequelize_1.Op.and]: [
                        {
                            latitude: {
                                [sequelize_1.Op.gte]: rideLatitude - distanceInKm * (1 / 111.111),
                                [sequelize_1.Op.lte]: rideLatitude + distanceInKm * (1 / 111.111),
                            },
                        },
                        {
                            longitude: {
                                [sequelize_1.Op.gte]: rideLongitude -
                                    distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)), // Consider Earth's curvature for longitude
                                [sequelize_1.Op.lte]: rideLongitude +
                                    distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)),
                            },
                        },
                    ],
                },
                attributes: ['user', 'latitude', 'longitude'],
                raw: true,
            });
            const driver_vehicle_types = yield Promise.all(driversInRange.map((driver) => __awaiter(this, void 0, void 0, function* () {
                const vehicle = yield vehicle_model_1.default.findOne({
                    where: { user: driver.user },
                    include: [
                        {
                            model: vehicleTypes_model_1.default,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                return (vehicle === null || vehicle === void 0 ? void 0 : vehicle.VehicleType.name) || 'Unknown';
            })));
            const enrichedDrivers = driversInRange.map((driver, index) => (Object.assign(Object.assign({}, driver), { vehicleType: driver_vehicle_types[index] })));
            return {
                message: constants_1.SuccessMsg.DRIVER.dashborad,
                driversInRange: enrichedDrivers,
            };
        });
    }
    AvailableVehicleCategories(rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield rides_model_1.default.findOne({ where: { id: rideId }, raw: true });
            // const distanceInKm = 100;
            const rideLatitude = ride.originLocation.lat;
            const rideLongitude = ride.originLocation.lng;
            const usersCity = yield (0, google_utils_1.getCity)(rideLatitude, rideLongitude);
            console.log('user city-------> ', usersCity);
            let driversInRange = yield userlocation_model_1.default.findAll({
                where: {
                    status: true,
                    // [Op.and]: [
                    //   {
                    //     latitude: {
                    //       [Op.gte]: rideLatitude - distanceInKm * (1 / 111.111),
                    //       [Op.lte]: rideLatitude + distanceInKm * (1 / 111.111),
                    //     },
                    //   },
                    //   {
                    //     longitude: {
                    //       [Op.gte]:
                    //         rideLongitude -
                    //         distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)), // Consider Earth's curvature for longitude
                    //       [Op.lte]:
                    //         rideLongitude +
                    //         distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)),
                    //     },
                    //   },
                    // ],
                },
                nest: true,
                raw: true,
            });
            driversInRange = yield Promise.all(driversInRange.map((driver) => __awaiter(this, void 0, void 0, function* () {
                const user = yield users_model_1.default.findOne({ where: { id: driver.user } });
                console.log(user.city);
                // if (user.driver_available && !user.driver_available.status) {
                //   return null;
                // } else
                return driver;
                // else if (user.city === usersCity) {
                // return driver;
                // }
            })));
            driversInRange = driversInRange.filter((driver) => driver !== null);
            let driversWithDetails = yield Promise.all(driversInRange.map((driver) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const driverLocation = {
                        lat: parseFloat(driver === null || driver === void 0 ? void 0 : driver.latitude),
                        lng: parseFloat(driver === null || driver === void 0 ? void 0 : driver.longitude),
                    };
                    const durationData = yield (0, google_utils_1.calculateDuration)(driverLocation, ride.originLocation);
                    if (!durationData)
                        return null; // Skip this driver if distance calculation failed.
                    const vehicleDetails = yield vehicle_model_1.default.findOne({
                        where: { user: driver.user },
                        attributes: ['user', 'category', 'type'],
                        include: [{ model: category_model_1.default }, { model: vehicleTypes_model_1.default }],
                        nest: true,
                        raw: true,
                    });
                    if (!vehicleDetails)
                        return null;
                    const price = yield pricemanagement_model_1.default.findOne({
                        where: { vehicleType: vehicleDetails.type, vehicleCategory: vehicleDetails.category },
                        attributes: [
                            'pricePerKm',
                            'pricePerMin',
                            'commissionPercentage',
                            'nightCharges',
                            'priceNightCharges',
                            'nightStartTime',
                            'nightEndTime',
                        ],
                        raw: true,
                    });
                    let fare = price ? ride.distanceInkm * price.pricePerKm : null;
                    if (price.nightCharges) {
                        let rideTime;
                        const dateVal = ride.date;
                        if (typeof dateVal === 'string') {
                            const parts = dateVal.split(' ');
                            rideTime = parts.length > 1 ? parts[1] : dateVal;
                        }
                        else if (dateVal instanceof Date) {
                            rideTime = dateVal.toISOString().split('T')[1].split('.')[0];
                        }
                        else {
                            throw new Error('Unsupported date format for ride.date');
                        }
                        const { nightStartTime, nightEndTime } = price;
                        if (nightStartTime && nightEndTime) {
                            const isNight = (rideTime >= nightStartTime && rideTime <= '23:59:59') ||
                                (rideTime >= '00:00:00' && rideTime <= nightEndTime);
                            if (isNight) {
                                fare = Number((fare + Number(price.priceNightCharges)).toFixed(2));
                            }
                        }
                    }
                    let useFare = fare;
                    const isAlreadyReferee = yield refferal_model_1.default.findOne({
                        where: { referee_id: ride.passengerId },
                        raw: true,
                    });
                    const referral = yield refferal_model_1.default.findOne({
                        where: {
                            [sequelize_1.Op.and]: [
                                {
                                    [sequelize_1.Op.or]: [
                                        {
                                            referee_id: ride.passengerId,
                                            status: 'pending',
                                            referee_use_count: { [sequelize_1.Op.lt]: 2 },
                                        },
                                        {
                                            referee_id: ride.passengerId,
                                            status: 'completed',
                                            referee_use_count: { [sequelize_1.Op.lt]: 2 },
                                        },
                                        ...(isAlreadyReferee
                                            ? []
                                            : [
                                                {
                                                    referrer_id: ride.passengerId,
                                                    status: 'completed',
                                                    referrer_use_count: { [sequelize_1.Op.lt]: 2 },
                                                },
                                            ]),
                                    ],
                                },
                                {
                                    [sequelize_1.Op.and]: [
                                        { status: { [sequelize_1.Op.ne]: 'expired' } },
                                        { [sequelize_1.Op.or]: [{ valid_until: null }, { valid_until: { [sequelize_1.Op.gte]: new Date() } }] },
                                    ],
                                },
                            ],
                        },
                        raw: true,
                    });
                    // Replace both if conditions with:
                    if (referral && fare) {
                        const discount = Math.min(fare * 0.5, 3000);
                        useFare = Number((fare - discount).toFixed(2));
                    }
                    let finalAmount = useFare;
                    const additionalFees = yield AdditionalFees_1.default.findAll({
                        where: { status: 'active', applyOn: 'ride_total' },
                        raw: true,
                    });
                    let totalAdditionalFee = 0;
                    if (useFare && additionalFees.length > 0) {
                        additionalFees.forEach((fee) => {
                            totalAdditionalFee += (useFare * fee.percentage) / 100;
                        });
                        finalAmount = useFare + totalAdditionalFee;
                    }
                    return Object.assign(Object.assign({}, vehicleDetails), { driverId: driver.user, fare,
                        useFare,
                        finalAmount, distanceInkm: durationData.distanceInkm, durationInmins: durationData.durationInmins });
                }
                catch (err) {
                    console.error('Error processing driver:', err);
                    return null;
                }
            })));
            driversWithDetails = driversWithDetails.filter((driver) => driver !== null);
            // console.log('driversWithDetails   --------------------------', driversWithDetails);
            const categoriesMap = {};
            driversWithDetails.forEach((details) => {
                const category = details.Category;
                const driverId = details.driverId;
                const vehicleType = details.VehicleType;
                const fare = details.useFare;
                const finalAmount = details.finalAmount;
                const distanceInkm = details.distanceInkm;
                const durationInmins = details.durationInmins;
                if (!categoriesMap[category.id]) {
                    categoriesMap[category.id] = {
                        category,
                        usefare: fare,
                        finalAmount,
                        vehicleType: vehicleType,
                        driverIds: [driverId],
                        distanceInkm,
                        durationInmins,
                    };
                }
                else {
                    if (!categoriesMap[category.id].driverIds.includes(driverId)) {
                        categoriesMap[category.id].driverIds.push(driverId);
                    }
                    if (fare !== null) {
                        categoriesMap[category.id].usefare = fare;
                    }
                    if (vehicleType !== null) {
                        categoriesMap[category.id].vehicleType = vehicleType;
                    }
                    categoriesMap[category.id].distanceInkm = distanceInkm;
                    categoriesMap[category.id].durationInmins = durationInmins;
                }
            });
            const uniqueCategoriesWithDrivers = Object.values(categoriesMap).map((item) => ({
                category: item.category,
                vehicleType: item.vehicleType,
                fare: item.usefare,
                finalAmount: item.finalAmount,
                driverIds: item.driverIds,
                distanceInkm: item.distanceInkm,
                durationInmins: item.durationInmins,
            }));
            yield rides_model_1.default.update({ driverAcceptStatus: 'pending' }, { where: { id: rideId } });
            return {
                status: 'success',
                message: 'Finding Driver for delivery',
                data: {
                    ride: rideId,
                    categoriesWithDrivers: uniqueCategoriesWithDrivers,
                },
            };
        });
    }
    selectDrivers(rideId, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield vehicle_model_1.default.findOne({
                where: { user: args.driverIds },
                attributes: ['category', 'type'],
                raw: true,
            });
            console.log('vehicleDetails:---------------> ', vehicleDetails.category);
            const rideDetails = yield rides_model_1.default.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['name', 'profile_picture'],
                    },
                ],
                raw: true,
                nest: true,
            });
            let rideTime;
            const dateVal = rideDetails === null || rideDetails === void 0 ? void 0 : rideDetails.date;
            if (typeof dateVal === 'string') {
                const parts = dateVal.split(' ');
                rideTime = parts.length > 1 ? parts[1] : dateVal;
            }
            else if (dateVal instanceof Date) {
                rideTime = dateVal.toISOString().split('T')[1].split('.')[0];
            }
            else {
                throw new Error('Unsupported date format for ride.date');
            }
            const price = yield pricemanagement_model_1.default.findOne({
                where: { vehicleType: vehicleDetails.type, vehicleCategory: vehicleDetails.category },
                attributes: [
                    'id',
                    'pricePerKm',
                    'pricePerMin',
                    'commissionPercentage',
                    'nightCharges',
                    'priceNightCharges',
                    'nightStartTime',
                    'nightEndTime',
                ],
                raw: true,
            });
            let fare = price ? rideDetails.distanceInkm * price.pricePerKm : null;
            if (price) {
                if (price.nightCharges && price.nightStartTime && price.nightEndTime) {
                    const isNight = (rideTime >= price.nightStartTime && rideTime <= '23:59:59') ||
                        (rideTime >= '00:00:00' && rideTime <= price.nightEndTime);
                    if (isNight) {
                        fare += Number(price.priceNightCharges);
                    }
                }
            }
            // -------------------- Referral Discount --------------------
            let useFare = fare;
            const isAlreadyReferee = yield refferal_model_1.default.findOne({
                where: { referee_id: rideDetails.passengerId },
                raw: true,
            });
            const referral = yield refferal_model_1.default.findOne({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            [sequelize_1.Op.or]: [
                                {
                                    referee_id: rideDetails.passengerId,
                                    status: 'pending',
                                    referee_use_count: { [sequelize_1.Op.lt]: 2 },
                                },
                                {
                                    referee_id: rideDetails.passengerId,
                                    status: 'completed',
                                    referee_use_count: { [sequelize_1.Op.lt]: 2 },
                                },
                                ...(isAlreadyReferee
                                    ? []
                                    : [
                                        {
                                            referrer_id: rideDetails.passengerId,
                                            status: 'completed',
                                            referrer_use_count: { [sequelize_1.Op.lt]: 2 },
                                        },
                                    ]),
                            ],
                        },
                        {
                            [sequelize_1.Op.and]: [
                                { status: { [sequelize_1.Op.ne]: 'expired' } },
                                { [sequelize_1.Op.or]: [{ valid_until: null }, { valid_until: { [sequelize_1.Op.gte]: new Date() } }] },
                            ],
                        },
                    ],
                },
                raw: true,
            });
            if (referral && fare) {
                const discount = Math.min(fare * 0.5, 3000); // 50% off up to 3000
                useFare = Number((fare - discount).toFixed(2));
            }
            // -------------------- Commission Calculation --------------------
            let commissionAmount = null;
            if (price && useFare) {
                commissionAmount = Number(((Number(price.commissionPercentage) / 100) * useFare).toFixed(2));
            }
            // -------------------- Additional Fees --------------------
            const additionalFees = yield AdditionalFees_1.default.findAll({
                where: { status: 'active', applyOn: 'ride_total' },
                raw: true,
            });
            let totalAdditionalFee = 0;
            if (fare && additionalFees.length > 0) {
                additionalFees.forEach((fee) => {
                    totalAdditionalFee += (fare * fee.percentage) / 100;
                });
            }
            const finalAmount = useFare + totalAdditionalFee;
            // -------------------- Update Ride --------------------
            yield rides_model_1.default.update({
                fare: fare,
                finalAmount: finalAmount,
                driverCommissionPer: price.commissionPercentage,
                driverCommissionAmount: commissionAmount,
            }, {
                where: { id: rideId },
            });
            yield Promise.all(args.driverIds.map((driver) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Triggering socket event for driver: ${driver}`);
                server_1.io.of('/drivers').emit(`RideRequests_${driver}`, {
                    message: Object.assign(Object.assign({}, rideDetails), { fare }),
                });
                const user = yield users_model_1.default.findOne({ where: { id: driver } });
                if (user.fcm_token)
                    yield (0, notifications_utils_1.sendDriverNotification)(user, {
                        title: `You have an Ride Request`,
                        type: `ride_request`,
                        body: `There is request from a passenger for ride`,
                        data: Object.assign(Object.assign({}, rideDetails), { fare, notification_type: 'Ride_Request' }),
                    });
            })));
            yield rides_model_1.default.update({ driverAcceptStatus: 'pending' }, { where: { id: rideId } });
            return {
                message: constants_1.SuccessMsg.DRIVER.searchDriver,
            };
        });
    }
    addInstructions(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield rides_model_1.default.findOne({ where: { id: rideId } });
            if (!ride) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            yield rides_model_1.default.update(args, { where: { id: rideId } });
            const user = yield users_model_1.default.findOne({ where: { id: ride.driverId } });
            if (user.fcm_token) {
                yield (0, notifications_utils_1.sendDriverNotification)(user, {
                    title: `Customer's Instruction`,
                    type: `instructions`,
                    body: `There is message from customer for you`,
                    data: { rideId: rideId, notification_type: 'instructions' },
                });
            }
            return {
                message: constants_1.SuccessMsg.DRIVER.addInstructions,
            };
        });
    }
    verifyCoupon(args, rideId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield rides_model_1.default.findOne({
                where: { id: rideId },
                raw: true,
            });
            if (!ride) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            const coupon = yield coupon_model_1.default.findOne({
                where: { code: args.code, status: 'active' },
                raw: true,
            });
            if (!coupon) {
                Utils.throwError(constants_1.ErrorMsg.COUPONS.notFound);
            }
            if (coupon.isExpired) {
                Utils.throwError(constants_1.ErrorMsg.COUPONS.expired);
            }
            let discount = 0;
            let totalAmount = 0;
            if (type == 'verify') {
                if (coupon.type === 'percentage') {
                    discount = (coupon.maxDiscountAmount / 100) * ride.fare;
                }
                else if (coupon.type === 'fixed_money') {
                    discount = coupon.maxDiscountAmount;
                }
                totalAmount = ride.fare - discount;
                if (totalAmount <= 0) {
                    totalAmount = 0;
                }
            }
            else if (type == 'cancel') {
                yield rides_model_1.default.update({ coupon: null, finalAmount: ride.fare }, { where: { id: rideId } });
            }
            const updatedRide = yield rides_model_1.default.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: coupon_model_1.default,
                        attributes: ['id', 'title', 'subTitle'],
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.COUPONS.redeem,
                amount: totalAmount,
                ride: updatedRide,
            };
        });
    }
    redeemCoupons(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield coupon_model_1.default.findOne({
                where: { code: args.code, status: 'active', isExpired: false },
                raw: true,
            });
            if (!coupon) {
                Utils.throwError(constants_1.ErrorMsg.COUPONS.invalid);
            }
            const ride = yield rides_model_1.default.findOne({
                where: { id: rideId },
                raw: true,
            });
            if (!ride) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            if (ride.coupon) {
                Utils.throwError(constants_1.ErrorMsg.COUPONS.alreadyRedeem);
            }
            let discount = 0;
            if (coupon.type === 'percentage') {
                discount = (coupon.maxDiscountAmount / 100) * ride.fare;
            }
            else if (coupon.type === 'fixed_money') {
                discount = coupon.maxDiscountAmount;
            }
            let totalAmount = ride.fare - discount;
            if (totalAmount <= 0) {
                totalAmount = 0;
            }
            yield rides_model_1.default.update({ coupon: coupon.id, finalAmount: totalAmount }, { where: { id: rideId } });
            const updatedRide = yield rides_model_1.default.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: coupon_model_1.default,
                        attributes: ['id', 'title', 'subTitle'],
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.COUPONS.redeem,
                ride: updatedRide,
            };
        });
    }
})();
//# sourceMappingURL=customer.service.js.map