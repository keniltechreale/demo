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
exports.sendWeeklyStatement = exports.sendScheduleRideNotification = void 0;
const sequelize_1 = require("sequelize");
const rides_model_1 = __importDefault(require("../models/rides.model"));
const users_model_1 = __importDefault(require("../models/users.model"));
const logger_1 = __importDefault(require("./logger"));
const notifications_utils_1 = require("./notifications.utils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const vehicle_model_1 = __importDefault(require("../models/vehicle.model"));
const weeklyStatement_model_1 = __importDefault(require("../models/weeklyStatement.model"));
const sendScheduleRideNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const nowUtc = moment_timezone_1.default.utc();
    const fifteenMinutesLaterIST = (0, moment_timezone_1.default)(nowUtc).add(15, 'minutes');
    console.log('now---------------->', nowUtc.format());
    console.log('fifteenMinutesLater---------------->', fifteenMinutesLaterIST.format());
    try {
        const rides = yield rides_model_1.default.findAll({
            where: {
                date: {
                    [sequelize_1.Op.between]: [nowUtc.toDate(), fifteenMinutesLaterIST.toDate()],
                },
                isNotified: false,
                status: 'scheduled',
            },
        });
        console.log('rides,', rides);
        for (const ride of rides) {
            const driver = yield users_model_1.default.findOne({ where: { id: ride.driverId }, raw: true });
            const user = yield users_model_1.default.findOne({ where: { id: ride.passengerId }, raw: true });
            const payload = {
                title: 'Your Next Ride',
                body: 'Your scheduled ride is in a few minutes.',
                type: 'scheduleRides',
                data: { ride },
            };
            yield users_model_1.default.update({ driver_available: { status: false, ride: ride.id } }, { where: { id: ride.driverId } });
            yield users_model_1.default.update({ ongoing_rides: { status: true, ride: ride.id } }, { where: { id: ride.passengerId } });
            if (driver && driver.fcm_token) {
                yield (0, notifications_utils_1.sendDriverNotification)(driver, payload);
            }
            if (user && user.fcm_token) {
                yield (0, notifications_utils_1.sendCustomerNotification)(user, payload);
            }
            logger_1.default.info(`Scheduled ride notification sent for ride ${ride.id}`);
            yield rides_model_1.default.update({ isNotified: true, status: 'reminderSent' }, { where: { id: ride.id } });
        }
    }
    catch (error) {
        logger_1.default.error('Error processing scheduled ride notifications:', error);
    }
});
exports.sendScheduleRideNotification = sendScheduleRideNotification;
const sendWeeklyStatement = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = getPreviousWeekRange();
        const verifiedVehicles = yield vehicle_model_1.default.findAll({
            where: { verified: true, category: { [sequelize_1.Op.ne]: null } },
            include: ['User'],
        });
        for (const vehicle of verifiedVehicles) {
            const userId = vehicle.user;
            yield weeklyStatement_model_1.default.create({
                user: userId,
                file: null,
                startDate: startDate,
                endDate: endDate,
            });
            logger_1.default.info(`Weekly statement created for user ${userId}`);
        }
    }
    catch (error) {
        logger_1.default.error('Error while creating weekly statements:', error);
    }
});
exports.sendWeeklyStatement = sendWeeklyStatement;
function getPreviousWeekRange() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek - 6);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    return { startDate: formattedStartDate, endDate: formattedEndDate };
}
//# sourceMappingURL=scheduleRideCron.utils.js.map