import UserLocation, { ILocation } from '../../models/userlocation.model';
import Vehicle, { IVehicle } from '../../models/vehicle.model';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Documents, { IDocument } from '../../models/documents.model';
import { ISearch } from '../../lib/common.interface';
import CityManagement, { ICityManagement } from '../../models/citymanagement.model';
import { Op, literal } from 'sequelize';
import * as Utils from '../../lib/utils';
import Users, { IUser } from '../../models/users.model';
import Rides, { IRide } from '../../models/rides.model';
import VehicleCategory from '../../models/vehicleTypes.model';
import { io } from '../../server';
import OTP, { IOTP } from '../../models/otp.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
import VehicleTypes from '../../models/vehicleTypes.model';
import Category from '../../models/category.model';
import Ratings, { IRating } from '../../models/ratings.model';
import Transactions, { ITransaction } from '../../models/transaction.model';
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { convertDecimalHoursToTime, getTodayEarnings } from '../../lib/helpFunctions';
import PriceManagement, { IPriceManagement } from '../../models/pricemanagement.model';
import { calculateDuration } from '../../lib/google.utils';

interface WeekData {
  date: string;
  earnings: number;
  trips: number;
  tips: number;
  totalAmount: number;
}

export default new (class DriverService {
  async getDocuments(args: ISearch, city: string) {
    let existCity: ICityManagement;

    const vehicleType = parseInt(args.vehicleType);
    const documents: IDocument[] = await Documents.findAll({
      where: { isRequired: true, status: true },
    });

    if (city) {
      existCity = await CityManagement.findOne({
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
      const filteredCityDocuments = await Documents.findAll({
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
  }

  async dashboard(userId: number) {
    const todayEaring = await getTodayEarnings(userId);
    console.log('todayEaring  --', todayEaring);

    const existVehicle: IVehicle = await Vehicle.findOne({
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
    } else {
      documents = { status: 'pending' };
    }
    const users: IUser = await Users.findByPk(userId);

    const location: ILocation = await UserLocation.findOne({ where: { user: userId } });
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
  }

  async ChangeConnectionStatus(args: Record<string, unknown>, userId: number) {
    const { showCard, ...requestData } = args;

    if (showCard) {
      await Vehicle.update({ showCard: false }, { where: { user: userId } });
    }
    if (requestData.status && requestData.latitude === '0' && requestData.longitude === '0') {
      Utils.throwError('Latitude Longitude are required');
    }

    const existVehicle: IVehicle = await Vehicle.findOne({
      where: { user: userId, verified: true },
    });
    if (!existVehicle) {
      Utils.throwError(ErrorMsg.VEHICLE.notVerified);
    }

    let existLocation: ILocation = await UserLocation.findOne({ where: { user: userId } });
    if (requestData.status === true) {
      requestData.online_since = new Date();
    }
    if (existLocation) {
      await UserLocation.update(requestData, { where: { user: userId } });
      existLocation = await UserLocation.findOne({ where: { user: userId } });
    } else {
      existLocation = await UserLocation.create({ user: userId, ...args });
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

      console.log(
        '--------------total_online_hours',
        total_online_hours,
        days_online,
        average_daily_hours,
      );

      await UserLocation.update(
        {
          total_online_hours: total_online_hours,
          days_online: days_online,
          average_daily_hours: average_daily_hours,
        },
        { where: { user: userId } },
      );
    }
    await Users.update({ is_driver_online: is_driver_online }, { where: { id: userId } });
    return {
      message: SuccessMsg.DRIVER.ConnectionStatus,
      location: existLocation,
    };
  }

  async rideRequest(driverId: number, rideId: string, type: string) {
    const ride: IRide = await Rides.findOne({
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
    const user = await Users.findOne({ where: { id: ride.passengerId } });

    if (type === 'accept') {
      const vehicleDetails: IVehicle = await Vehicle.findOne({
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
      const vehicleCategory = await VehicleCategory.findOne({
        where: { id: vehicleDetails.type },
        raw: true,
      });
      console.log('ride', ride);

      let status;
      if (ride.isScheduled) {
        status = 'scheduled';
      } else {
        status = 'driverAccepted';
      }
      console.log('status', status);

      await Rides.update(
        {
          driverAcceptStatus: 'accepted',
          driverId: driverId,
          status: status,
          vehicleType: vehicleDetails.type,
          vehicleId: vehicleDetails.id,
        },
        { where: { id: parseInt(rideId) } },
      );

      await Users.update(
        { driver_available: { status: false, ride: rideId } },
        { where: { id: driverId } },
      );

      await Users.update(
        {
          ongoing_rides: {
            status: true,
            ride: ride.id,
          },
        },
        { where: { id: user.id } },
      );
      const driverdetails = await Users.findOne({
        where: { id: driverId },
        attributes: ['name', 'email', 'country_code', 'phone_number', 'profile_picture'],
        raw: true,
      });

      const otp = Utils.generateOTP();
      const newOtp = await OTP.create({ type: 'pickup', ride: rideId, user: driverId, otp: otp });

      const ratingDetails: IRating[] = await Ratings.findAll({ where: { driver: driverId } });
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
        await sendCustomerNotification(user, {
          title: `Rides Accepted`,
          type: `ride_accepted`,
          body: `Your ride request is accepted by ${driverdetails.name}`,
          data: { ride: ride },
        });
      }
      return {
        message: SuccessMsg.DRIVER.orderAccepted,
      };
    } else {
      io.of('/customers').emit(`OrderRequest_${rideId}`, {
        message: {
          status: 'decline',
          message: `The Request is been declined by driver, search for better riders`,
        },
      });
      if (user.fcm_token) {
        await sendCustomerNotification(user, {
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
  }

  async verifyRideOtp(args: Record<string, string>, rideId: string, userId: number) {
    const ride: IRide = await Rides.findOne({ where: { id: rideId } });
    if (ride.driverId !== userId) {
      Utils.throwError('Not correct Ride');
    }
    const otp: IOTP = await OTP.findOne({
      where: { user: userId, ride: rideId, type: 'pickup', otp: args.otp },
    });

    if (!otp) {
      Utils.throwError(ErrorMsg.USER.incorrectOtp);
    } else {
      await OTP.destroy({ where: { user: `${userId}`, type: 'pickup' } });
      await Rides.update(
        { status: 'in_progress', otpVerfied: true, pickupTime: new Date() },
        { where: { id: rideId } },
      );
      io.of('/customers').emit(`OrderRequest_${rideId}`, {
        message: { status: 'success', otpVerify: true },
      });
      const passenger = await Users.findOne({ where: { id: ride.passengerId } });
      const driver = await Users.findOne({ where: { id: ride.driverId } });

      if (passenger.fcm_token) {
        await sendCustomerNotification(passenger, {
          title: `Otp Verified`,
          type: `otp_verified`,
          body: `Your ride otp is verified by ${driver.name}`,
          data: { ride: ride },
        });
      }
      if (driver.fcm_token) {
        await sendDriverNotification(driver, {
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
  }

  async viewCustomerInstructions(rideId: string) {
    const ride: IRide | null = await Rides.findOne({
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
  }

  async getStatistics(driverId: number) {
    const today: Date = new Date();

    const startDate: Date = startOfWeek(today, { weekStartsOn: 1 });
    const endDate: Date = endOfWeek(today, { weekStartsOn: 1 });

    const weekData: WeekData[] = eachDayOfInterval({ start: startDate, end: endDate }).map(
      (date: Date) => ({
        date: format(date, 'yyyy-MM-dd'),
        earnings: 0,
        trips: 0,
        tips: 0,
        totalAmount: 0,
      }),
    );

    const weeklyTransactions: ITransaction[] = await Transactions.findAll({
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

    const totalTransactions: ITransaction[] = await Transactions.findAll({
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

    weeklyTransactions.forEach((transaction: ITransaction) => {
      const transactionDate: string = format(new Date(transaction.createdAt), 'yyyy-MM-dd');
      const dayData: WeekData | undefined = weekData.find((day) => day.date === transactionDate);

      if (dayData) {
        if (transaction.purpose === 'Ride Payment') {
          dayData.earnings += Number(transaction.amount);
          dayData.trips += 1;
          dayData.totalAmount += Number(transaction.amount);
          weeklyTotalEarnings += Number(transaction.amount);
          weeklyTotalTrips += 1;
        } else if (transaction.purpose === 'Ride Tip Payment' || transaction.type === 'tip') {
          dayData.tips += Number(transaction.amount);
          dayData.totalAmount += Number(transaction.amount);
          weeklyTotalTips += Number(transaction.amount);
        }
      }
    });

    let totalEarnings = 0;
    let totalTrips = 0;
    let totalTips = 0;

    totalTransactions.forEach((transaction: ITransaction) => {
      if (transaction.purpose === 'Ride Payment') {
        totalEarnings += Number(transaction.amount);
        totalTrips += 1;
      } else if (transaction.purpose === 'Ride Tip Payment' || transaction.type === 'tip') {
        totalTips += Number(transaction.amount);
        totalEarnings += Number(transaction.amount);
      }
    });
    const userLocation = await UserLocation.findOne({ where: { user: driverId } });

    const totalTime = convertDecimalHoursToTime(userLocation.total_online_hours);
    const averageTime = convertDecimalHoursToTime(userLocation.average_daily_hours);

    const vehicleDetails: IVehicle = await Vehicle.findOne({
      where: { user: driverId },
      attributes: ['category', 'type'],
      raw: true,
    });

    const price: IPriceManagement = await PriceManagement.findOne({
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
  }

  async distanceCount(args: Record<string, unknown>, rideId: string) {
    console.log('0-0-0', args, rideId);

    const ride: IRide = await Rides.findOne({ where: { id: rideId } });
    if (!ride) {
      Utils.throwError(ErrorMsg.RIDES.notFound);
    }

    let rideLocation;

    if (ride.status === 'in_progress') {
      rideLocation = ride.destinationLocation;
    } else {
      rideLocation = ride.originLocation;
    }

    const distanceToOrigin = await calculateDuration(
      { lat: Number(args.latitude), lng: Number(args.longitude) },
      rideLocation,
    );

    return {
      message: SuccessMsg.RIDES.distanceCount,
      distance: distanceToOrigin,
    };
  }
})();
