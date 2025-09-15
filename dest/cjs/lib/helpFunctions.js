"use strict";
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
exports.rideCompletion = exports.getTodayEarnings = exports.convertDecimalHoursToTime = exports.generateTransactionRef = exports.generateUniqueCouponCode = exports.deleteDriverRelatedData = exports.calculateAmount = exports.generateUniqueRidesId = exports.generateReferCode = exports.generateUniqueID = void 0;
const pricemanagement_model_1 = __importDefault(require("../models/pricemanagement.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const logger_1 = __importDefault(require("./logger"));
const citymanagement_model_1 = __importDefault(require("../models/citymanagement.model"));
const vehicle_model_1 = __importDefault(require("../models/vehicle.model"));
const fileUpload_utils_1 = require("./fileUpload.utils");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const sequelize_1 = require("sequelize");
const sequelize_2 = require("sequelize");
const rides_model_1 = __importDefault(require("../models/rides.model"));
const notifications_utils_1 = require("./notifications.utils");
const email_utils_1 = require("./email.utils");
const refferal_model_1 = __importDefault(require("../models/refferal.model"));
// import logger from './logger';
// import logger from './logger';
// import Vehicle from '../models/vehicle.model';
// import { deleteAllFiles } from './fileUpload.utils';
function isIdPresentInDB(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existUser = yield users_model_1.default.findOne({ where: { user_id: id } });
        return existUser ? true : false;
    });
}
function generateUniqueID(region) {
    return __awaiter(this, void 0, void 0, function* () {
        const countryCode = region ? region : `DV`;
        let id;
        const countryCodeUpperCase = countryCode.toUpperCase();
        id = `${countryCodeUpperCase}${Math.floor(100000 + Math.random() * 900000)}`;
        while (yield isIdPresentInDB(id)) {
            id = `${countryCodeUpperCase}${Math.floor(100000 + Math.random() * 900000)}`;
        }
        return id;
    });
}
exports.generateUniqueID = generateUniqueID;
function generateReferCode() {
    function getRandomNumber() {
        return Math.floor(Math.random() * 10);
    }
    let code = 'ZR';
    for (let i = 0; i < 6; i++) {
        code += getRandomNumber();
    }
    return code;
}
exports.generateReferCode = generateReferCode;
function generateUniqueRidesId() {
    const timestamp = new Date().getTime().toString(36).toUpperCase();
    const randomString = Math.random().toString(36).slice(2, 7).toUpperCase();
    const uniqueId = `${timestamp}-${randomString}`;
    return uniqueId;
}
exports.generateUniqueRidesId = generateUniqueRidesId;
function calculateAmount(vehicleType, city, distance) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const existCity = yield citymanagement_model_1.default.findOne({ where: { city: city } });
            const price = yield pricemanagement_model_1.default.findOne({
                where: {
                    vehicleType: vehicleType,
                    city: `${existCity.id}`,
                },
            });
            if (!price) {
                return {
                    totalAmount: 100,
                    currency: 'dollars',
                    currencySymbol: '$',
                };
            }
            else {
                const distanceAmount = distance * price.pricePerKm;
                const totalAmount = distanceAmount + price.minimumFareUSD + price.baseFareUSD;
                return {
                    totalAmount: totalAmount,
                    currency: price.currency,
                    currencySymbol: price.currencySymbol,
                };
            }
        }
        catch (err) {
            logger_1.default.error(`Error in user related data ${err}`);
        }
    });
}
exports.calculateAmount = calculateAmount;
function deleteDriverRelatedData(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const vehicleData = yield vehicle_model_1.default.findOne({ where: { user: `${user.id}` } });
            if (vehicleData) {
                yield (0, fileUpload_utils_1.deleteAllFilesFromS3)(vehicleData);
            }
            return 'Profile deletion complete';
        }
        catch (err) {
            logger_1.default.error(`Error in user related data ${err}`);
        }
    });
}
exports.deleteDriverRelatedData = deleteDriverRelatedData;
function generateUniqueCouponCode() {
    const length = 12;
    const characters = '01234ABCDEFGHIJK09876LMNOPQRSTUVQXYZ6543216589';
    let couponCode = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters[randomIndex];
    }
    return couponCode;
}
exports.generateUniqueCouponCode = generateUniqueCouponCode;
const generateTransactionRef = (length) => {
    let result = '';
    const characters = 'QwrtfghfyntbuhjgntybfhjbjKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0356468952362265123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return `flw_tx_ref_${result}`;
};
exports.generateTransactionRef = generateTransactionRef;
function convertDecimalHoursToTime(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return { hours, minutes };
}
exports.convertDecimalHoursToTime = convertDecimalHoursToTime;
function getTodayEarnings(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            console.log('today', today);
            console.log('startOfDay', startOfDay);
            console.log('endOfDay', endOfDay);
            const totalEarnings = yield transaction_model_1.default.findAll({
                attributes: [[sequelize_1.Sequelize.fn('SUM', sequelize_1.Sequelize.col('amount')), 'totalEarnings']],
                where: {
                    user: userId,
                    transactionType: 'credit',
                    category: 'earning',
                    [sequelize_2.Op.and]: [
                        {
                            createdAt: {
                                [sequelize_2.Op.between]: [startOfDay, endOfDay], // Filter by today's date
                            },
                        },
                        {
                            [sequelize_2.Op.or]: [{ type: 'ride' }, { type: 'tip' }, { type: 'wallet' }],
                        },
                    ],
                },
                raw: true,
            });
            console.log('totalEarnings', totalEarnings);
            const total = parseFloat(totalEarnings[0].totalEarnings) || 0; // Convert result to number
            console.log('total', total);
            return total;
        }
        catch (error) {
            console.error('Error fetching total earnings:', error);
            return 0; // Return 0 if there's an error
        }
    });
}
exports.getTodayEarnings = getTodayEarnings;
function rideCompletion(ridesDetails) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield users_model_1.default.update({ driver_available: { status: true, ride: '' } }, { where: { id: ridesDetails.driverId } });
            yield users_model_1.default.update({ ongoing_rides: { status: false, ride: '' } }, { where: { id: ridesDetails.passengerId } });
            const passenger = yield users_model_1.default.findOne({ where: { id: ridesDetails.passengerId } });
            const driver = yield users_model_1.default.findOne({ where: { id: ridesDetails.driverId } });
            // Get original fare from ride details
            let finalFare = ridesDetails.fare || 0;
            let discountApplied = 0;
            let referralToUpdate = null;
            // Apply referral discount logic
            if (ridesDetails.fare && ridesDetails.fare > 0) {
                // First, check if passenger is already a referee (to prevent nested referrals)
                const isAlreadyReferee = yield refferal_model_1.default.findOne({
                    where: {
                        referee_id: ridesDetails.passengerId,
                    },
                    raw: true,
                });
                const referral = yield refferal_model_1.default.findOne({
                    where: {
                        [sequelize_2.Op.and]: [
                            {
                                [sequelize_2.Op.or]: [
                                    // Only allow referee discount if they are actually a referee
                                    {
                                        referee_id: ridesDetails.passengerId,
                                        status: 'pending',
                                        referee_use_count: { [sequelize_2.Op.lt]: 2 },
                                    },
                                    {
                                        referee_id: ridesDetails.passengerId,
                                        status: 'completed',
                                        referee_use_count: { [sequelize_2.Op.lt]: 2 },
                                    },
                                    ...(isAlreadyReferee
                                        ? []
                                        : [
                                            {
                                                referrer_id: ridesDetails.passengerId,
                                                status: 'completed',
                                                referrer_use_count: { [sequelize_2.Op.lt]: 2 },
                                            },
                                        ]),
                                ],
                            },
                            {
                                [sequelize_2.Op.or]: [{ valid_until: null }, { valid_until: { [sequelize_2.Op.gte]: new Date() } }],
                            },
                        ],
                    },
                    raw: false,
                });
                console.log('referral found ------------>', referral);
                if (referral) {
                    discountApplied = Math.min(ridesDetails.fare * 0.5, 3000);
                    finalFare = Number((ridesDetails.fare - discountApplied).toFixed(2));
                    referralToUpdate = referral;
                }
            }
            yield rides_model_1.default.update({
                dropOffTime: new Date(),
                fare: finalFare,
                discount_applied: discountApplied,
            }, { where: { id: ridesDetails.id } });
            // Update referral record if discount was applied
            if (referralToUpdate) {
                const updateData = {};
                // Safely get current counts
                const currentRefereeCount = Number(referralToUpdate.referee_use_count) || 0;
                const currentReferrerCount = Number(referralToUpdate.referrer_use_count) || 0;
                if (referralToUpdate.referee_id === ridesDetails.passengerId) {
                    updateData.referee_use_count = currentRefereeCount + 1;
                    // ✅ Transition only once: pending → completed (on referee's first ride)
                    if (referralToUpdate.status === 'pending') {
                        updateData.status = 'completed';
                    }
                }
                else if (referralToUpdate.referrer_id === ridesDetails.passengerId) {
                    updateData.referrer_use_count = currentReferrerCount + 1;
                    // No status change for referrer, they just consume their benefit
                }
                // ✅ Set valid_until on first use if not already set
                if (!referralToUpdate.valid_until && currentRefereeCount + currentReferrerCount === 0) {
                    updateData.valid_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
                }
                yield refferal_model_1.default.update(updateData, {
                    where: { id: referralToUpdate.id },
                });
            }
            // Send notifications (existing logic)
            if (passenger && passenger.fcm_token) {
                yield (0, notifications_utils_1.sendCustomerNotification)(passenger, {
                    title: `Ride Completed`,
                    type: `ride_complete`,
                    body: `Your ride has completed with ${driver.name}, Rate your Driver now.`,
                    data: { ride: Object.assign(Object.assign({}, ridesDetails), { fare: finalFare }) },
                });
            }
            if (passenger.fcm_token) {
                yield (0, notifications_utils_1.sendCustomerNotification)(passenger, {
                    title: `Ride Completed`,
                    type: `ride_complete`,
                    body: `Your ride has completed with ${driver.name}, Rate your Driver now.`,
                    data: { ride: ridesDetails },
                });
            }
            if (driver.fcm_token) {
                yield (0, notifications_utils_1.sendDriverNotification)(driver, {
                    title: `Ride Completed`,
                    type: `ride_complete`,
                    body: `Your ride has completed with ${passenger.name}, Rate your Customer now.`,
                    data: { ride: ridesDetails },
                });
            }
            yield (0, email_utils_1.sendRideCompletionMail)(ridesDetails.passenger, ridesDetails);
            yield rides_model_1.default.update({ dropOffTime: new Date() }, { where: { id: ridesDetails.id } });
        }
        catch (err) {
            logger_1.default.error(`Error in user related data ${err}`);
        }
    });
}
exports.rideCompletion = rideCompletion;
//# sourceMappingURL=helpFunctions.js.map