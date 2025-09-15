var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserLocation from '../../models/userlocation.model';
import Vehicles from '../../models/vehicle.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Rides from '../../models/rides.model';
import Users from '../../models/users.model';
import { io } from '../../server';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';
import Category from '../../models/category.model';
import PriceManagement from '../../models/pricemanagement.model';
import { calculateDuration, getCity } from '../../lib/google.utils';
import { sendDriverNotification } from '../../lib/notifications.utils';
import Coupons from '../../models/coupon.model';
import AdditionalFee from '../../models/AdditionalFees';
import Referrals from '../../models/refferal.model';
export default new (class CustomerService {
    ViewDashboard(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const distanceInKm = 100;
            const rideLatitude = args.lat;
            const rideLongitude = args.long;
            const driversInRange = yield UserLocation.findAll({
                where: {
                    status: true,
                    [Op.and]: [
                        {
                            latitude: {
                                [Op.gte]: rideLatitude - distanceInKm * (1 / 111.111),
                                [Op.lte]: rideLatitude + distanceInKm * (1 / 111.111),
                            },
                        },
                        {
                            longitude: {
                                [Op.gte]: rideLongitude -
                                    distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)), // Consider Earth's curvature for longitude
                                [Op.lte]: rideLongitude +
                                    distanceInKm * (1 / (Math.cos((rideLatitude * Math.PI) / 180) * 111.111)),
                            },
                        },
                    ],
                },
                attributes: ['user', 'latitude', 'longitude'],
                raw: true,
            });
            const driver_vehicle_types = yield Promise.all(driversInRange.map((driver) => __awaiter(this, void 0, void 0, function* () {
                const vehicle = yield Vehicles.findOne({
                    where: { user: driver.user },
                    include: [
                        {
                            model: VehicleTypes,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                return (vehicle === null || vehicle === void 0 ? void 0 : vehicle.VehicleType.name) || 'Unknown';
            })));
            const enrichedDrivers = driversInRange.map((driver, index) => (Object.assign(Object.assign({}, driver), { vehicleType: driver_vehicle_types[index] })));
            return {
                message: SuccessMsg.DRIVER.dashborad,
                driversInRange: enrichedDrivers,
            };
        });
    }
    AvailableVehicleCategories(rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield Rides.findOne({ where: { id: rideId }, raw: true });
            // const distanceInKm = 100;
            const rideLatitude = ride.originLocation.lat;
            const rideLongitude = ride.originLocation.lng;
            const usersCity = yield getCity(rideLatitude, rideLongitude);
            console.log('user city-------> ', usersCity);
            let driversInRange = yield UserLocation.findAll({
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
                const user = yield Users.findOne({ where: { id: driver.user } });
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
                    const durationData = yield calculateDuration(driverLocation, ride.originLocation);
                    if (!durationData)
                        return null; // Skip this driver if distance calculation failed.
                    const vehicleDetails = yield Vehicles.findOne({
                        where: { user: driver.user },
                        attributes: ['user', 'category', 'type'],
                        include: [{ model: Category }, { model: VehicleTypes }],
                        nest: true,
                        raw: true,
                    });
                    if (!vehicleDetails)
                        return null;
                    const price = yield PriceManagement.findOne({
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
                    const isAlreadyReferee = yield Referrals.findOne({
                        where: { referee_id: ride.passengerId },
                        raw: true,
                    });
                    const referral = yield Referrals.findOne({
                        where: {
                            [Op.and]: [
                                {
                                    [Op.or]: [
                                        {
                                            referee_id: ride.passengerId,
                                            status: 'pending',
                                            referee_use_count: { [Op.lt]: 2 },
                                        },
                                        {
                                            referee_id: ride.passengerId,
                                            status: 'completed',
                                            referee_use_count: { [Op.lt]: 2 },
                                        },
                                        ...(isAlreadyReferee
                                            ? []
                                            : [
                                                {
                                                    referrer_id: ride.passengerId,
                                                    status: 'completed',
                                                    referrer_use_count: { [Op.lt]: 2 },
                                                },
                                            ]),
                                    ],
                                },
                                {
                                    [Op.and]: [
                                        { status: { [Op.ne]: 'expired' } },
                                        { [Op.or]: [{ valid_until: null }, { valid_until: { [Op.gte]: new Date() } }] },
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
                    const additionalFees = yield AdditionalFee.findAll({
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
            yield Rides.update({ driverAcceptStatus: 'pending' }, { where: { id: rideId } });
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
            const vehicleDetails = yield Vehicles.findOne({
                where: { user: args.driverIds },
                attributes: ['category', 'type'],
                raw: true,
            });
            console.log('vehicleDetails:---------------> ', vehicleDetails.category);
            const rideDetails = yield Rides.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: Users,
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
            const price = yield PriceManagement.findOne({
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
            const isAlreadyReferee = yield Referrals.findOne({
                where: { referee_id: rideDetails.passengerId },
                raw: true,
            });
            const referral = yield Referrals.findOne({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    referee_id: rideDetails.passengerId,
                                    status: 'pending',
                                    referee_use_count: { [Op.lt]: 2 },
                                },
                                {
                                    referee_id: rideDetails.passengerId,
                                    status: 'completed',
                                    referee_use_count: { [Op.lt]: 2 },
                                },
                                ...(isAlreadyReferee
                                    ? []
                                    : [
                                        {
                                            referrer_id: rideDetails.passengerId,
                                            status: 'completed',
                                            referrer_use_count: { [Op.lt]: 2 },
                                        },
                                    ]),
                            ],
                        },
                        {
                            [Op.and]: [
                                { status: { [Op.ne]: 'expired' } },
                                { [Op.or]: [{ valid_until: null }, { valid_until: { [Op.gte]: new Date() } }] },
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
            const additionalFees = yield AdditionalFee.findAll({
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
            yield Rides.update({
                fare: fare,
                finalAmount: finalAmount,
                driverCommissionPer: price.commissionPercentage,
                driverCommissionAmount: commissionAmount,
            }, {
                where: { id: rideId },
            });
            yield Promise.all(args.driverIds.map((driver) => __awaiter(this, void 0, void 0, function* () {
                console.log(`Triggering socket event for driver: ${driver}`);
                io.of('/drivers').emit(`RideRequests_${driver}`, {
                    message: Object.assign(Object.assign({}, rideDetails), { fare }),
                });
                const user = yield Users.findOne({ where: { id: driver } });
                if (user.fcm_token)
                    yield sendDriverNotification(user, {
                        title: `You have an Ride Request`,
                        type: `ride_request`,
                        body: `There is request from a passenger for ride`,
                        data: Object.assign(Object.assign({}, rideDetails), { fare, notification_type: 'Ride_Request' }),
                    });
            })));
            yield Rides.update({ driverAcceptStatus: 'pending' }, { where: { id: rideId } });
            return {
                message: SuccessMsg.DRIVER.searchDriver,
            };
        });
    }
    addInstructions(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield Rides.findOne({ where: { id: rideId } });
            if (!ride) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            yield Rides.update(args, { where: { id: rideId } });
            const user = yield Users.findOne({ where: { id: ride.driverId } });
            if (user.fcm_token) {
                yield sendDriverNotification(user, {
                    title: `Customer's Instruction`,
                    type: `instructions`,
                    body: `There is message from customer for you`,
                    data: { rideId: rideId, notification_type: 'instructions' },
                });
            }
            return {
                message: SuccessMsg.DRIVER.addInstructions,
            };
        });
    }
    verifyCoupon(args, rideId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const ride = yield Rides.findOne({
                where: { id: rideId },
                raw: true,
            });
            if (!ride) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            const coupon = yield Coupons.findOne({
                where: { code: args.code, status: 'active' },
                raw: true,
            });
            if (!coupon) {
                Utils.throwError(ErrorMsg.COUPONS.notFound);
            }
            if (coupon.isExpired) {
                Utils.throwError(ErrorMsg.COUPONS.expired);
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
                yield Rides.update({ coupon: null, finalAmount: ride.fare }, { where: { id: rideId } });
            }
            const updatedRide = yield Rides.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: Coupons,
                        attributes: ['id', 'title', 'subTitle'],
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: SuccessMsg.COUPONS.redeem,
                amount: totalAmount,
                ride: updatedRide,
            };
        });
    }
    redeemCoupons(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const coupon = yield Coupons.findOne({
                where: { code: args.code, status: 'active', isExpired: false },
                raw: true,
            });
            if (!coupon) {
                Utils.throwError(ErrorMsg.COUPONS.invalid);
            }
            const ride = yield Rides.findOne({
                where: { id: rideId },
                raw: true,
            });
            if (!ride) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            if (ride.coupon) {
                Utils.throwError(ErrorMsg.COUPONS.alreadyRedeem);
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
            yield Rides.update({ coupon: coupon.id, finalAmount: totalAmount }, { where: { id: rideId } });
            const updatedRide = yield Rides.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: Coupons,
                        attributes: ['id', 'title', 'subTitle'],
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: SuccessMsg.COUPONS.redeem,
                ride: updatedRide,
            };
        });
    }
})();
//# sourceMappingURL=customer.service.js.map