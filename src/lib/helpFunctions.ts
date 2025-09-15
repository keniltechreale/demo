import PriceManagement from '../models/pricemanagement.model';
import Users, { IUser } from '../models/users.model';
import { IPriceManagement } from '../middleware/validation.middleware';
import logger from './logger';
import CityManagement, { ICityManagement } from '../models/citymanagement.model';
import Vehicle from '../models/vehicle.model';
import { deleteAllFilesFromS3 } from './fileUpload.utils';
import Transactions from '../models/transaction.model';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import Ride, { IRide } from '../models/rides.model';
import { sendCustomerNotification, sendDriverNotification } from './notifications.utils';
import { sendRideCompletionMail } from './email.utils';
import Referrals from '../models/refferal.model';
// import logger from './logger';
// import logger from './logger';
// import Vehicle from '../models/vehicle.model';
// import { deleteAllFiles } from './fileUpload.utils';

async function isIdPresentInDB(id: string): Promise<boolean> {
  const existUser = await Users.findOne({ where: { user_id: id } });
  return existUser ? true : false;
}

export async function generateUniqueID(region: string): Promise<string> {
  const countryCode = region ? region : `DV`;
  let id: string;
  const countryCodeUpperCase = countryCode.toUpperCase();

  id = `${countryCodeUpperCase}${Math.floor(100000 + Math.random() * 900000)}`;
  while (await isIdPresentInDB(id)) {
    id = `${countryCodeUpperCase}${Math.floor(100000 + Math.random() * 900000)}`;
  }

  return id;
}

export function generateReferCode() {
  function getRandomNumber() {
    return Math.floor(Math.random() * 10);
  }
  let code = 'ZR';
  for (let i = 0; i < 6; i++) {
    code += getRandomNumber();
  }
  return code;
}

export function generateUniqueRidesId() {
  const timestamp = new Date().getTime().toString(36).toUpperCase();
  const randomString = Math.random().toString(36).slice(2, 7).toUpperCase();
  const uniqueId = `${timestamp}-${randomString}`;

  return uniqueId;
}

export async function calculateAmount(vehicleType: number, city: string, distance: number) {
  try {
    const existCity: ICityManagement = await CityManagement.findOne({ where: { city: city } });
    const price: IPriceManagement = await PriceManagement.findOne({
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
    } else {
      const distanceAmount = distance * price.pricePerKm;
      const totalAmount = distanceAmount + price.minimumFareUSD + price.baseFareUSD;

      return {
        totalAmount: totalAmount,
        currency: price.currency,
        currencySymbol: price.currencySymbol,
      };
    }
  } catch (err) {
    logger.error(`Error in user related data ${err}`);
  }
}

export async function deleteDriverRelatedData(user: IUser) {
  try {
    const vehicleData = await Vehicle.findOne({ where: { user: `${user.id}` } });
    if (vehicleData) {
      await deleteAllFilesFromS3(vehicleData);
    }
    return 'Profile deletion complete';
  } catch (err) {
    logger.error(`Error in user related data ${err}`);
  }
}

export function generateUniqueCouponCode() {
  const length = 12;
  const characters = '01234ABCDEFGHIJK09876LMNOPQRSTUVQXYZ6543216589';
  let couponCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    couponCode += characters[randomIndex];
  }

  return couponCode;
}

export const generateTransactionRef = (length: number) => {
  let result = '';
  const characters =
    'QwrtfghfyntbuhjgntybfhjbjKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0356468952362265123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return `flw_tx_ref_${result}`;
};

export function convertDecimalHoursToTime(decimalHours: number) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);

  return { hours, minutes };
}

export async function getTodayEarnings(userId: number): Promise<number> {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    console.log('today', today);
    console.log('startOfDay', startOfDay);
    console.log('endOfDay', endOfDay);

    const totalEarnings = await Transactions.findAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'totalEarnings']],
      where: {
        user: userId,
        transactionType: 'credit',
        category: 'earning',
        [Op.and]: [
          {
            createdAt: {
              [Op.between]: [startOfDay, endOfDay], // Filter by today's date
            },
          },
          {
            [Op.or]: [{ type: 'ride' }, { type: 'tip' }, { type: 'wallet' }],
          },
        ],
      },
      raw: true,
    });
    console.log('totalEarnings', totalEarnings);

    const total = parseFloat(totalEarnings[0].totalEarnings) || 0; // Convert result to number
    console.log('total', total);

    return total;
  } catch (error) {
    console.error('Error fetching total earnings:', error);
    return 0; // Return 0 if there's an error
  }
}

export async function rideCompletion(ridesDetails: IRide) {
  try {
    await Users.update(
      { driver_available: { status: true, ride: '' } },
      { where: { id: ridesDetails.driverId } },
    );
    await Users.update(
      { ongoing_rides: { status: false, ride: '' } },
      { where: { id: ridesDetails.passengerId } },
    );
    const passenger = await Users.findOne({ where: { id: ridesDetails.passengerId } });
    const driver = await Users.findOne({ where: { id: ridesDetails.driverId } });

    // Get original fare from ride details
    let finalFare = ridesDetails.fare || 0;
    let discountApplied = 0;
    let referralToUpdate = null;

    // Apply referral discount logic
    if (ridesDetails.fare && ridesDetails.fare > 0) {
      // First, check if passenger is already a referee (to prevent nested referrals)
      const isAlreadyReferee = await Referrals.findOne({
        where: {
          referee_id: ridesDetails.passengerId,
        },
        raw: true,
      });

      const referral = await Referrals.findOne({
        where: {
          [Op.and]: [
            {
              [Op.or]: [
                // Only allow referee discount if they are actually a referee
                {
                  referee_id: ridesDetails.passengerId,
                  status: 'pending',
                  referee_use_count: { [Op.lt]: 2 },
                },
                {
                  referee_id: ridesDetails.passengerId,
                  status: 'completed',
                  referee_use_count: { [Op.lt]: 2 },
                },
                ...(isAlreadyReferee
                  ? []
                  : [
                      {
                        referrer_id: ridesDetails.passengerId,
                        status: 'completed',
                        referrer_use_count: { [Op.lt]: 2 },
                      },
                    ]),
              ],
            },
            {
              [Op.or]: [{ valid_until: null }, { valid_until: { [Op.gte]: new Date() } }],
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

    await Ride.update(
      {
        dropOffTime: new Date(),
        fare: finalFare,
        discount_applied: discountApplied,
      },
      { where: { id: ridesDetails.id } },
    );

    // Update referral record if discount was applied
    if (referralToUpdate) {
      const updateData: {
        referee_use_count?: number;
        referrer_use_count?: number;
        status?: 'pending' | 'completed' | 'expired';
        valid_until?: Date;
      } = {};

      // Safely get current counts
      const currentRefereeCount = Number(referralToUpdate.referee_use_count) || 0;
      const currentReferrerCount = Number(referralToUpdate.referrer_use_count) || 0;

      if (referralToUpdate.referee_id === ridesDetails.passengerId) {
        updateData.referee_use_count = currentRefereeCount + 1;

        // ✅ Transition only once: pending → completed (on referee's first ride)
        if (referralToUpdate.status === 'pending') {
          updateData.status = 'completed';
        }
      } else if (referralToUpdate.referrer_id === ridesDetails.passengerId) {
        updateData.referrer_use_count = currentReferrerCount + 1;
        // No status change for referrer, they just consume their benefit
      }

      // ✅ Set valid_until on first use if not already set
      if (!referralToUpdate.valid_until && currentRefereeCount + currentReferrerCount === 0) {
        updateData.valid_until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
      }

      await Referrals.update(updateData, {
        where: { id: referralToUpdate.id },
      });
    }
    // Send notifications (existing logic)
    if (passenger && passenger.fcm_token) {
      await sendCustomerNotification(passenger, {
        title: `Ride Completed`,
        type: `ride_complete`,
        body: `Your ride has completed with ${driver.name}, Rate your Driver now.`,
        data: { ride: { ...ridesDetails, fare: finalFare } },
      });
    }

    if (passenger.fcm_token) {
      await sendCustomerNotification(passenger, {
        title: `Ride Completed`,
        type: `ride_complete`,
        body: `Your ride has completed with ${driver.name}, Rate your Driver now.`,
        data: { ride: ridesDetails },
      });
    }
    if (driver.fcm_token) {
      await sendDriverNotification(driver, {
        title: `Ride Completed`,
        type: `ride_complete`,
        body: `Your ride has completed with ${passenger.name}, Rate your Customer now.`,
        data: { ride: ridesDetails },
      });
    }

    await sendRideCompletionMail(ridesDetails.passenger, ridesDetails);
    await Ride.update({ dropOffTime: new Date() }, { where: { id: ridesDetails.id } });
  } catch (err) {
    logger.error(`Error in user related data ${err}`);
  }
}
