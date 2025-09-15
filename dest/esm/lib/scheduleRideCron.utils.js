var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Op } from 'sequelize';
import Ride from '../models/rides.model';
import Users from '../models/users.model';
import logger from './logger';
import { sendCustomerNotification, sendDriverNotification } from './notifications.utils';
import moment from 'moment-timezone';
import Vehicle from '../models/vehicle.model';
import WeeklyStatement from '../models/weeklyStatement.model';
export const sendScheduleRideNotification = () => __awaiter(void 0, void 0, void 0, function* () {
    const nowUtc = moment.utc();
    const fifteenMinutesLaterIST = moment(nowUtc).add(15, 'minutes');
    console.log('now---------------->', nowUtc.format());
    console.log('fifteenMinutesLater---------------->', fifteenMinutesLaterIST.format());
    try {
        const rides = yield Ride.findAll({
            where: {
                date: {
                    [Op.between]: [nowUtc.toDate(), fifteenMinutesLaterIST.toDate()],
                },
                isNotified: false,
                status: 'scheduled',
            },
        });
        console.log('rides,', rides);
        for (const ride of rides) {
            const driver = yield Users.findOne({ where: { id: ride.driverId }, raw: true });
            const user = yield Users.findOne({ where: { id: ride.passengerId }, raw: true });
            const payload = {
                title: 'Your Next Ride',
                body: 'Your scheduled ride is in a few minutes.',
                type: 'scheduleRides',
                data: { ride },
            };
            yield Users.update({ driver_available: { status: false, ride: ride.id } }, { where: { id: ride.driverId } });
            yield Users.update({ ongoing_rides: { status: true, ride: ride.id } }, { where: { id: ride.passengerId } });
            if (driver && driver.fcm_token) {
                yield sendDriverNotification(driver, payload);
            }
            if (user && user.fcm_token) {
                yield sendCustomerNotification(user, payload);
            }
            logger.info(`Scheduled ride notification sent for ride ${ride.id}`);
            yield Ride.update({ isNotified: true, status: 'reminderSent' }, { where: { id: ride.id } });
        }
    }
    catch (error) {
        logger.error('Error processing scheduled ride notifications:', error);
    }
});
export const sendWeeklyStatement = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = getPreviousWeekRange();
        const verifiedVehicles = yield Vehicle.findAll({
            where: { verified: true, category: { [Op.ne]: null } },
            include: ['User'],
        });
        for (const vehicle of verifiedVehicles) {
            const userId = vehicle.user;
            yield WeeklyStatement.create({
                user: userId,
                file: null,
                startDate: startDate,
                endDate: endDate,
            });
            logger.info(`Weekly statement created for user ${userId}`);
        }
    }
    catch (error) {
        logger.error('Error while creating weekly statements:', error);
    }
});
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