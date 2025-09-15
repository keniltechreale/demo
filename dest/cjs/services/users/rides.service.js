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
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const helpFunctions_1 = require("../../lib/helpFunctions");
const users_model_1 = __importDefault(require("../../models/users.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
const google_utils_1 = require("../../lib/google.utils");
const admin_model_1 = __importDefault(require("../../models/admin.model"));
const ratings_model_1 = __importDefault(require("../../models/ratings.model"));
const coupon_model_1 = __importDefault(require("../../models/coupon.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const generatePDF_utils_1 = require("../../lib/generatePDF.utils");
const aws_utils_1 = require("../../lib/aws.utils");
const aws_config_1 = __importDefault(require("../../config/aws.config"));
const uuid_1 = require("uuid");
const server_1 = require("../../server");
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const countrydata_model_1 = __importDefault(require("../../models/countrydata.model"));
exports.default = new (class RidesService {
    addRides(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // const customer = await Users.findOne({ where: { id: user.id } });
            // if (customer.ongoing_rides && customer?.ongoing_rides?.status) {
            //   Utils.throwError(ErrorMsg.RIDES.userBusy);
            // }
            const uniqueId = (0, helpFunctions_1.generateUniqueRidesId)();
            const originAddress = `${args.origin}`.replace(/\s/g, '+');
            const destinationAddress = `${args.destination}`.replace(/\s/g, '+');
            const calculateDistances = yield (0, google_utils_1.calculateDistance)(originAddress, destinationAddress);
            const currentDate = new Date();
            // const rideDateTime = new Date(args.date as string);
            const localRideDate = new Date(args.date);
            const rideDateTimeUTC = new Date(localRideDate.toISOString());
            const timeThresholdMinutes = 5;
            const timeDifferenceMinutes = Math.floor((rideDateTimeUTC.getTime() - currentDate.getTime()) / (1000 * 60));
            const isScheduled = timeDifferenceMinutes > timeThresholdMinutes;
            const newRides = yield rides_model_1.default.create(Object.assign(Object.assign({ rideId: uniqueId, passengerId: user.id, isScheduled, status: 'pending' }, args), calculateDistances));
            const admin = yield admin_model_1.default.findOne({ raw: true });
            yield notifications_model_1.default.create({
                admin: admin.id,
                title: 'Rides Booked',
                type: 'rides',
                body: 'A new rides is been booked',
                meta_data: { ride: newRides.id },
            });
            return {
                message: constants_1.SuccessMsg.RIDES.add,
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
            const totalCount = yield rides_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ridesDetails = yield rides_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: vehicle_model_1.default,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: coupon_model_1.default,
                    },
                ],
                raw: true,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.RIDES.get,
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
            const ridesDetails = yield rides_model_1.default.findOne({
                where: { id: args.rideId },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: vehicle_model_1.default,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: coupon_model_1.default,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!ridesDetails) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            let otp;
            if ((ridesDetails.status === 'reminderSent' || ridesDetails.status === 'driverAccepted') &&
                user.role === 'customer') {
                const OTPDetails = yield otp_model_1.default.findOne({
                    where: { type: 'pickup', ride: ridesDetails.id, user: ridesDetails.driverId },
                });
                otp = OTPDetails.otp;
            }
            if (!ridesDetails.file && ridesDetails.status === 'completed') {
                const pdfBuffer = yield (0, generatePDF_utils_1.createRideEmailPdf)(ridesDetails.passenger, ridesDetails);
                const filename = `${ridesDetails.passengerId}${args.rideId}-${(0, uuid_1.v4)()}`;
                const filepath = `assets/pdf/${filename}.pdf`;
                const uploadedFileUrl = `/${filepath}`;
                const uploadParams = {
                    Body: pdfBuffer,
                    Key: filepath,
                    Bucket: aws_config_1.default.s3BucketName,
                };
                yield (0, aws_utils_1.uploadFileToS3)(uploadParams);
                yield rides_model_1.default.update({ file: uploadedFileUrl }, { where: { id: args.rideId } });
                ridesDetails.file = uploadedFileUrl;
            }
            return {
                message: constants_1.SuccessMsg.RIDES.get,
                rides: ridesDetails,
                otp: otp,
            };
        });
    }
    updateRides(args, rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ridesDetails = yield rides_model_1.default.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: vehicle_model_1.default,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: coupon_model_1.default,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!ridesDetails) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            // -------------------- Ratings --------------------
            if (args.customerFeedBack) {
                const feedBack = args.customerFeedBack;
                const totalRating = feedBack.reduce((sum, item) => sum + item.rate, 0);
                const averageRating = totalRating / feedBack.length;
                args.customerRating = averageRating;
                const existrating = yield ratings_model_1.default.findOne({
                    where: {
                        user: ridesDetails.passengerId,
                        driver: ridesDetails.driverId,
                        ride: rideId,
                        type: 'driver',
                    },
                });
                if (existrating) {
                    Utils.throwError(constants_1.ErrorMsg.RATINGS.alreadyExist);
                }
                yield ratings_model_1.default.create({
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
                const existrating = yield ratings_model_1.default.findOne({
                    where: {
                        user: ridesDetails.passengerId,
                        driver: ridesDetails.driverId,
                        ride: rideId,
                        type: 'customer',
                    },
                });
                if (existrating) {
                    Utils.throwError(constants_1.ErrorMsg.RATINGS.alreadyExist);
                }
                yield ratings_model_1.default.create({
                    user: ridesDetails.passengerId,
                    driver: ridesDetails.passengerId,
                    type: 'customer',
                    ride: rideId,
                    stars: averageRating,
                });
            }
            // -------------------- Ride Completion Logic --------------------
            if (args.status && args.status === 'completed' && ridesDetails.paymentSuccessful) {
                yield (0, helpFunctions_1.rideCompletion)(ridesDetails);
            }
            else if (args.status === 'completed') {
                args.status = 'finishTrip';
            }
            if (args.status && args.status === 'cashPayment') {
                const user = yield users_model_1.default.findOne({ where: { id: ridesDetails.driverId }, raw: true });
                yield (0, notifications_utils_1.sendDriverNotification)(user, {
                    title: `Collect Cash Payment!`,
                    type: `cashPayment`,
                    body: `${ridesDetails.passenger.name} wants to pay via cash.`,
                    data: { ride: rideId },
                });
                const ride = yield rides_model_1.default.findOne({ where: { id: rideId }, raw: true });
                console.log('Ride:', ride);
                server_1.io.of(`/rides/${rideId}`).emit(`VerifyPayment_${rideId}`, {
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
                    yield (0, helpFunctions_1.rideCompletion)(ridesDetails);
                }
                else {
                    args.status = ridesDetails.status;
                }
                const existWallet = yield wallet_model_1.default.findOne({ where: { user: ridesDetails.driverId } });
                const deductAmount = Number(ridesDetails.finalAmount) - Number(ridesDetails.driverCommissionAmount);
                const newAmount = (Number(existWallet.amount) - deductAmount).toFixed(2);
                const updatedWallet = yield wallet_model_1.default.update({ amount: newAmount }, { where: { user: ridesDetails.driverId } });
                const senderTxRefId = (0, helpFunctions_1.generateTransactionRef)(12);
                yield transaction_model_1.default.create({
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
            yield rides_model_1.default.update(args, { where: { id: rideId } });
            ridesDetails = yield rides_model_1.default.findOne({ where: { id: rideId } });
            return {
                message: constants_1.SuccessMsg.RIDES.updated,
                rides: ridesDetails,
            };
        });
    }
    deleteRides(args, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const ridesDetails = yield rides_model_1.default.findOne({ where: { id: args.rideId } });
            if (!ridesDetails) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            yield users_model_1.default.update({ driver_available: { status: true, ride: '' } }, { where: { id: ridesDetails.driverId } });
            yield users_model_1.default.update({ ongoing_rides: { status: false, ride: '' } }, { where: { id: ridesDetails.passengerId } });
            yield rides_model_1.default.update({ status: 'cancelled' }, { where: { id: args.rideId } });
            if (user.role === 'driver' && user.fcm_token) {
                const customer = yield users_model_1.default.findOne({ where: { id: ridesDetails.passengerId } });
                if (customer && customer.fcm_token) {
                    yield (0, notifications_utils_1.sendCustomerNotification)(customer, {
                        title: `Ride Cancelled!`,
                        body: `Regret to inform that ride ${ridesDetails.rideId} is cancelled by driver. Please book another rides.`,
                        data: {},
                        type: `rideCancelled`,
                    });
                }
            }
            else if (user && user.role === 'customer') {
                const driver = yield users_model_1.default.findOne({ where: { id: ridesDetails.driverId } });
                if (driver && driver.fcm_token) {
                    yield (0, notifications_utils_1.sendDriverNotification)(driver, {
                        title: `Ride Cancelled!`,
                        type: `rideCancelled`,
                        body: `Regret to inform that ride ${ridesDetails.rideId} is cancelled by customer. Please look for another.`,
                        data: {},
                    });
                }
            }
            yield ratings_model_1.default.create({
                user: user.id,
                driver: user.id,
                stars: 1,
            });
            return {
                message: constants_1.SuccessMsg.RIDES.delete,
            };
        });
    }
    updateCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Utils.updateCountrySymbols();
            return {
                message: constants_1.SuccessMsg.RIDES.delete,
            };
        });
    }
    addCountry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Debug 1');
                const filePath = path_1.default.join(__dirname, '../../../../CountryData_pretty.json');
                // Check if the file exists
                if (!fs_1.default.existsSync(filePath)) {
                    throw new Error(`File not found: ${filePath}`);
                }
                const jsonData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
                console.log('Debug 2');
                for (const countryCode of Object.keys(jsonData.country)) {
                    console.log('countryCode ===> ', countryCode);
                    const countryData = jsonData.country[countryCode];
                    console.log('Debug 3');
                    yield countrydata_model_1.default.create({
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
            const ridesDetails = yield rides_model_1.default.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: vehicle_model_1.default,
                        attributes: ['vehicle_platenumber', 'vehicle_model', 'vehicle_color'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['id', 'name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: coupon_model_1.default,
                    },
                ],
                raw: true,
                nest: true,
            });
            if (!ridesDetails) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            const pdfBuffer = yield (0, generatePDF_utils_1.createRideEmailPdf)(user, ridesDetails);
            return pdfBuffer;
        });
    }
})();
//# sourceMappingURL=rides.service.js.map