var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import Rides from '../../models/rides.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { generateTransactionRef, generateUniqueRidesId, rideCompletion, } from '../../lib/helpFunctions';
import Users from '../../models/users.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import Vehicles from '../../models/vehicle.model';
import Notifications from '../../models/notifications.model';
import { calculateDistance } from '../../lib/google.utils';
import Admin from '../../models/admin.model';
import Rating from '../../models/ratings.model';
import Coupons from '../../models/coupon.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
import OTP from '../../models/otp.model';
import { createRideEmailPdf } from '../../lib/generatePDF.utils';
import { uploadFileToS3 } from '../../lib/aws.utils';
import awsConfig from '../../config/aws.config';
import { v4 as uuidv4 } from 'uuid';
import { io } from '../../server';
import Transactions from '../../models/transaction.model';
import Wallets from '../../models/wallet.model';
import path from 'path';
import fs from 'fs';
import Country from '../../models/countrydata.model';
export default new (class RidesService {
    addRides(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // const customer = await Users.findOne({ where: { id: user.id } });
            // if (customer.ongoing_rides && customer?.ongoing_rides?.status) {
            //   Utils.throwError(ErrorMsg.RIDES.userBusy);
            // }
            const uniqueId = generateUniqueRidesId();
            const originAddress = `${args.origin}`.replace(/\s/g, '+');
            const destinationAddress = `${args.destination}`.replace(/\s/g, '+');
            const calculateDistances = yield calculateDistance(originAddress, destinationAddress);
            const currentDate = new Date();
            // const rideDateTime = new Date(args.date as string);
            const localRideDate = new Date(args.date);
            const rideDateTimeUTC = new Date(localRideDate.toISOString());
            const timeThresholdMinutes = 5;
            const timeDifferenceMinutes = Math.floor((rideDateTimeUTC.getTime() - currentDate.getTime()) / (1000 * 60));
            const isScheduled = timeDifferenceMinutes > timeThresholdMinutes;
            const newRides = yield Rides.create(Object.assign(Object.assign({ rideId: uniqueId, passengerId: user.id, isScheduled, status: 'pending' }, args), calculateDistances));
            const admin = yield Admin.findOne({ raw: true });
            yield Notifications.create({
                admin: admin.id,
                title: 'Rides Booked',
                type: 'rides',
                body: 'A new rides is been booked',
                meta_data: { ride: newRides.id },
            });
            return {
                message: SuccessMsg.RIDES.add,
                rides: newRides,
            };
        });
    }
    getRides(arg, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            const filterObject = {};
            if (user.role === 'customer') {
                filterObject.passengerId = user.id;
            }
            else if (user.role === 'driver') {
                filterObject.driverId = user.id;
            }
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject['$or'] = [{ itemType: new RegExp(search, 'ig') }];
            }
            const totalCount = yield Rides.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ridesDetails = yield Rides.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Vehicles,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Coupons,
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: SuccessMsg.RIDES.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                rides: ridesDetails,
            };
        });
    }
    getRidesById(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ridesDetails = yield Rides.findOne({
                where: { id: args.rideId },
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Vehicles,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Coupons,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!ridesDetails) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            let otp;
            if ((ridesDetails.status === 'reminderSent' || ridesDetails.status === 'driverAccepted') &&
                user.role === 'customer') {
                const OTPDetails = yield OTP.findOne({
                    where: { type: 'pickup', ride: ridesDetails.id, user: ridesDetails.driverId },
                });
                otp = OTPDetails.otp;
            }
            if (!ridesDetails.file && ridesDetails.status === 'completed') {
                const pdfBuffer = yield createRideEmailPdf(ridesDetails.passenger, ridesDetails);
                const filename = `${ridesDetails.passengerId}${args.rideId}-${uuidv4()}`;
                const filepath = `assets/pdf/${filename}.pdf`;
                const uploadedFileUrl = `/${filepath}`;
                const uploadParams = {
                    Body: pdfBuffer,
                    Key: filepath,
                    Bucket: awsConfig.s3BucketName,
                };
                yield uploadFileToS3(uploadParams);
                yield Rides.update({ file: uploadedFileUrl }, { where: { id: args.rideId } });
                ridesDetails.file = uploadedFileUrl;
            }
            return {
                message: SuccessMsg.RIDES.get,
                rides: ridesDetails,
                otp: otp,
            };
        });
    }
    updateRides(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ridesDetails = yield Rides.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Vehicles,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Coupons,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!ridesDetails) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            // -------------------- Ratings --------------------
            if (args.customerFeedBack) {
                const feedBack = args.customerFeedBack;
                const totalRating = feedBack.reduce((sum, item) => sum + item.rate, 0);
                const averageRating = totalRating / feedBack.length;
                args.customerRating = averageRating;
                const existrating = yield Rating.findOne({
                    where: {
                        user: ridesDetails.passengerId,
                        driver: ridesDetails.driverId,
                        ride: rideId,
                        type: 'driver',
                    },
                });
                if (existrating) {
                    Utils.throwError(ErrorMsg.RATINGS.alreadyExist);
                }
                yield Rating.create({
                    user: ridesDetails.passengerId,
                    driver: ridesDetails.driverId,
                    ride: rideId,
                    type: 'driver',
                    stars: averageRating,
                });
            }
            else if (args.driverFeedBack) {
                const feedBack = args.driverFeedBack;
                const totalRating = feedBack.reduce((sum, item) => sum + item.rate, 0);
                const averageRating = totalRating / feedBack.length;
                args.driverRating = averageRating;
                const existrating = yield Rating.findOne({
                    where: {
                        user: ridesDetails.passengerId,
                        driver: ridesDetails.driverId,
                        ride: rideId,
                        type: 'customer',
                    },
                });
                if (existrating) {
                    Utils.throwError(ErrorMsg.RATINGS.alreadyExist);
                }
                yield Rating.create({
                    user: ridesDetails.passengerId,
                    driver: ridesDetails.passengerId,
                    type: 'customer',
                    ride: rideId,
                    stars: averageRating,
                });
            }
            // -------------------- Ride Completion Logic --------------------
            if (args.status && args.status === 'completed' && ridesDetails.paymentSuccessful) {
                yield rideCompletion(ridesDetails);
            }
            else if (args.status === 'completed') {
                args.status = 'finishTrip';
            }
            if (args.status && args.status === 'cashPayment') {
                const user = yield Users.findOne({ where: { id: ridesDetails.driverId }, raw: true });
                yield sendDriverNotification(user, {
                    title: `Collect Cash Payment!`,
                    type: `cashPayment`,
                    body: `${ridesDetails.passenger.name} wants to pay via cash.`,
                    data: { ride: rideId },
                });
                const ride = yield Rides.findOne({ where: { id: rideId }, raw: true });
                console.log('Ride:', ride);
                io.of(`/rides/${rideId}`).emit(`VerifyPayment_${rideId}`, {
                    ride: ride,
                    purpose: 'Ride Payment',
                    status: 'success',
                    method: 'cash',
                    paySuccess: true,
                });
                args.status = ridesDetails.status;
            }
            if (args.status && args.status === 'collectCash') {
                if (ridesDetails.status === 'finishTrip') {
                    Object.assign(args, {
                        paymentSuccessful: true,
                        paymentStatus: 'success',
                        status: 'completed',
                        paymentMethod: 'cash',
                    });
                    yield rideCompletion(ridesDetails);
                }
                else {
                    args.status = ridesDetails.status;
                }
                const existWallet = yield Wallets.findOne({ where: { user: ridesDetails.driverId } });
                const deductAmount = Number(ridesDetails.finalAmount) - Number(ridesDetails.driverCommissionAmount);
                const newAmount = (Number(existWallet.amount) - deductAmount).toFixed(2);
                const updatedWallet = yield Wallets.update({ amount: newAmount }, { where: { user: ridesDetails.driverId } });
                const senderTxRefId = generateTransactionRef(12);
                yield Transactions.create({
                    user: ridesDetails.driverId,
                    rideId: rideId,
                    amount: deductAmount,
                    currency: existWallet.currency,
                    transactionType: 'debit',
                    paymentMethod: 'cashPayment',
                    purpose: 'Ride Cash Payment Debit',
                    tx_ref: senderTxRefId,
                    status: 'success',
                    currentWalletbalance: updatedWallet,
                    type: 'ride',
                    method: 'wallet',
                    category: 'earning',
                });
            }
            if (args.date) {
                const currentDate = new Date();
                const localRideDate = new Date(args.date);
                const rideDateTimeUTC = new Date(localRideDate.toISOString());
                const timeThresholdMinutes = 5;
                const timeDifferenceMinutes = Math.floor((rideDateTimeUTC.getTime() - currentDate.getTime()) / (1000 * 60));
                args.isScheduled = timeDifferenceMinutes > timeThresholdMinutes;
            }
            yield Rides.update(args, { where: { id: rideId } });
            ridesDetails = yield Rides.findOne({ where: { id: rideId } });
            return {
                message: SuccessMsg.RIDES.updated,
                rides: ridesDetails,
            };
        });
    }
    deleteRides(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ridesDetails = yield Rides.findOne({ where: { id: args.rideId } });
            if (!ridesDetails) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            yield Users.update({ driver_available: { status: true, ride: '' } }, { where: { id: ridesDetails.driverId } });
            yield Users.update({ ongoing_rides: { status: false, ride: '' } }, { where: { id: ridesDetails.passengerId } });
            yield Rides.update({ status: 'cancelled' }, { where: { id: args.rideId } });
            if (user.role === 'driver' && user.fcm_token) {
                const customer = yield Users.findOne({ where: { id: ridesDetails.passengerId } });
                if (customer && customer.fcm_token) {
                    yield sendCustomerNotification(customer, {
                        title: `Ride Cancelled!`,
                        body: `Regret to inform that ride ${ridesDetails.rideId} is cancelled by driver. Please book another rides.`,
                        data: {},
                        type: `rideCancelled`,
                    });
                }
            }
            else if (user && user.role === 'customer') {
                const driver = yield Users.findOne({ where: { id: ridesDetails.driverId } });
                if (driver && driver.fcm_token) {
                    yield sendDriverNotification(driver, {
                        title: `Ride Cancelled!`,
                        type: `rideCancelled`,
                        body: `Regret to inform that ride ${ridesDetails.rideId} is cancelled by customer. Please look for another.`,
                        data: {},
                    });
                }
            }
            yield Rating.create({
                user: user.id,
                driver: user.id,
                stars: 1,
            });
            return {
                message: SuccessMsg.RIDES.delete,
            };
        });
    }
    updateCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Utils.updateCountrySymbols();
            return {
                message: SuccessMsg.RIDES.delete,
            };
        });
    }
    addCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Debug 1');
                const filePath = path.join(__dirname, '../../../../CountryData_pretty.json');
                // Check if the file exists
                if (!fs.existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }
                const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                console.log('Debug 2');
                for (const countryCode of Object.keys(jsonData.country)) {
                    console.log('countryCode ===> ', countryCode);
                    const countryData = jsonData.country[countryCode];
                    console.log('Debug 3');
                    yield Country.create({
                        countryCode,
                        currencyCode: countryData.currency.currencyCode,
                        currencyName: countryData.currency.currencyName,
                        currencySymbol: countryData.currency.currencySymbol,
                        shortName: countryData.info.shortName,
                        longName: countryData.info.longName,
                        alpha2: countryData.info.alpha2,
                        alpha3: countryData.info.alpha3,
                        isoNumericCode: countryData.info.isoNumericCode,
                        ioc: countryData.info.ioc,
                        capitalCity: countryData.info.capitalCity,
                        tld: countryData.info.tld,
                    });
                }
                console.log('Debug 5');
                console.log('Countries added to the database successfully!');
                return {
                    message: 'Countries added successfully!', // Update the success message
                };
            }
            catch (error) {
                console.error('Error adding countries to the database:', error);
                throw error; // Re-throw the error for better error handling upstream
            }
        });
    }
    downloadRidePdf(rideId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ridesDetails = yield Rides.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Vehicles,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Coupons,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!ridesDetails) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            const pdfBuffer = yield createRideEmailPdf(user, ridesDetails);
            return pdfBuffer;
        });
    }
})();
//# sourceMappingURL=rides.service.js.map