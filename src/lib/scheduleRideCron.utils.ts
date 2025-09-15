import { Op } from 'sequelize';
import Ride, { IRide } from '../models/rides.model';
import Users from '../models/users.model';
import logger from './logger';
import { sendCustomerNotification, sendDriverNotification } from './notifications.utils';
import moment from 'moment-timezone';
import Vehicle from '../models/vehicle.model';
import WeeklyStatement from '../models/weeklyStatement.model';

export const sendScheduleRideNotification = async () => {
  const nowUtc = moment.utc();
  const fifteenMinutesLaterIST = moment(nowUtc).add(15, 'minutes');
  console.log('now---------------->', nowUtc.format());
  console.log('fifteenMinutesLater---------------->', fifteenMinutesLaterIST.format());

  try {
    const rides: IRide[] = await Ride.findAll({
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
      const driver = await Users.findOne({ where: { id: ride.driverId }, raw: true });
      const user = await Users.findOne({ where: { id: ride.passengerId }, raw: true });

      const payload = {
        title: 'Your Next Ride',
        body: 'Your scheduled ride is in a few minutes.',
        type: 'scheduleRides',
        data: { ride },
      };

      await Users.update(
        { driver_available: { status: false, ride: ride.id } },
        { where: { id: ride.driverId } },
      );
      await Users.update(
        { ongoing_rides: { status: true, ride: ride.id } },
        { where: { id: ride.passengerId } },
      );
      if (driver && driver.fcm_token) {
        await sendDriverNotification(driver, payload);
      }

      if (user && user.fcm_token) {
        await sendCustomerNotification(user, payload);
      }

      logger.info(`Scheduled ride notification sent for ride ${ride.id}`);
      await Ride.update({ isNotified: true, status: 'reminderSent' }, { where: { id: ride.id } });
    }
  } catch (error) {
    logger.error('Error processing scheduled ride notifications:', error);
  }
};

export const sendWeeklyStatement = async () => {
  try {
    const { startDate, endDate } = getPreviousWeekRange();

    const verifiedVehicles = await Vehicle.findAll({
      where: { verified: true, category: { [Op.ne]: null } },
      include: ['User'],
    });
    for (const vehicle of verifiedVehicles) {
      const userId = vehicle.user;

      await WeeklyStatement.create({
        user: userId,
        file: null,
        startDate: startDate,
        endDate: endDate,
      });

      logger.info(`Weekly statement created for user ${userId}`);
    }
  } catch (error) {
    logger.error('Error while creating weekly statements:', error);
  }
};

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
