import Sequelize, { Op } from 'sequelize';
import Vehicles, { IVehicle } from '../../models/vehicle.model';
import * as Utils from '../../lib/utils';
import Users, { IUser } from '../../models/users.model';
import Rides, { IRide } from '../../models/rides.model';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { deleteDriverRelatedData, generateUniqueID } from '../../lib/helpFunctions';
import { sendDocumentVerificationMail } from '../../lib/email.utils';
import VehicleTypes, { IVehicleTypes } from '../../models/vehicleTypes.model';
import Category from '../../models/category.model';
import Notifications from '../../models/notifications.model';
import { sendDriverNotification } from '../../lib/notifications.utils';
import Wallets from '../../models/wallet.model';
import EmergencyContact from '../../models/emergencycontact.model';
import Ratings from '../../models/ratings.model';
import UserAddress from '../../models/useraddress.model';
import UserLocation from '../../models/userlocation.model';
import Transactions, { ITransaction } from '../../models/transaction.model';

export default new (class UsersService {
  async addDriver(args: Record<string, unknown>) {
    const existUser: IUser = await Users.findOne({
      where: {
        country_code: args.country_code,
        phone_number: args.phone_number,
      },
    });
    if (existUser) {
      Utils.throwError(ErrorMsg.USER.phoneAlreadyExist);
    }
    const existEmail: IUser = await Users.findOne({
      where: { email: args.email },
    });
    if (existEmail) {
      Utils.throwError(ErrorMsg.USER.emailAlreadyExist);
    }

    const uniqueUserId: string = await generateUniqueID(`IND`);
    const newUser: IUser = await Users.create({ user_id: uniqueUserId, ...args });

    return {
      message: SuccessMsg.USER.register,
      user: newUser,
    };
  }

  // async addDriverVehicle(args: IVehicleData, userId: string) {
  //   const existVehicle: IVehicle = await Vehicles.findOne({ user: userId });
  //   if (existVehicle) {
  //     Utils.throwError(ErrorMsg.VEHICLE.alreadyExist);
  //   }
  //   let defaultIsVerified;
  //   if (args.type === 'bike') {
  //     defaultIsVerified = {
  //       vehicle_exterior_image: { status: 'pending', reason: undefined },
  //       driving_license: { status: 'pending', reason: undefined },
  //       ownership_certificate: { status: 'pending', reason: undefined },
  //       government_issuedID: { status: 'pending', reason: undefined },
  //       roadworthiness: { status: 'pending', reason: undefined },
  //       inspection_report: { status: 'pending', reason: undefined },
  //       LASSRA_LASDRI_card: { status: 'pending', reason: undefined },
  //     };
  //   } else {
  //     defaultIsVerified = {
  //       vehicle_exterior_image: { status: 'pending', reason: undefined },
  //       vehicle_interior_image: { status: 'pending', reason: undefined },
  //       driving_license: { status: 'pending', reason: undefined },
  //       ownership_certificate: { status: 'pending', reason: undefined },
  //       government_issuedID: { status: 'pending', reason: undefined },
  //       roadworthiness: { status: 'pending', reason: undefined },
  //       inspection_report: { status: 'pending', reason: undefined },
  //       LASSRA_LASDRI_card: { status: 'pending', reason: undefined },
  //     };
  //   }

  //   const documentStatus: Record<keyof IVehicleData, { status: string; reason?: string }> =
  //     Object.keys(defaultIsVerified).reduce(
  //       (acc, key) => {
  //         const typedKey = key as keyof IVehicleData;
  //         acc[typedKey] = {
  //           status: args[typedKey] ? 'approved' : 'pending',
  //           reason: args[typedKey] ? undefined : undefined,
  //         };
  //         return acc;
  //       },
  //       {} as Record<keyof IVehicleData, { status: string; reason?: string }>,
  //     );

  //   const newVehicle: IVehicle = new Vehicles({
  //     user: userId,
  //     verified: true,
  //     ...args,
  //     documentStatus,
  //   });
  //   await newVehicle.save();

  //   return {
  //     message: SuccessMsg.Vehicle.add,
  //     vehicle: newVehicle,
  //   };
  // }

  async userCount() {
    const year = '2024';
    const driverCount = await Users.count({ where: { role: 'driver' } });
    const customerCount = await Users.count({ where: { role: 'customer' } });
    const ridesCount = await Rides.count();

    const statusCounts: IRide[] = await Rides.findAll({
      attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
      group: 'status',
      raw: true,
    });

    const initialAccumulator: Record<string, number> = {};

    const result = {
      total: ridesCount,
      ...statusCounts.reduce((acc: Record<string, number>, item: IRide) => {
        acc[item.status] = item.count;
        return acc;
      }, initialAccumulator),
    };
    const startDate = new Date(`${year}-01-01`);
    const endDate = new Date(`${year}-12-31`);

    const rideStatistics = await Rides.findAll({
      attributes: [
        [Sequelize.fn('MONTH', Sequelize.col('date')), 'month'],
        [Sequelize.literal(`SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END)`), 'bookedCount'],
        [
          Sequelize.literal(`SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)`),
          'cancelledCount',
        ],
        [
          Sequelize.literal(`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`),
          'completedCount',
        ],
        [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount'], // Total count of rides in the month
      ],
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [Sequelize.fn('MONTH', Sequelize.col('date'))],
      order: [[Sequelize.fn('MONTH', Sequelize.col('date')), 'ASC']],
      raw: true,
    });

    const vehicleTypeCount = await VehicleTypes.count();
    return {
      message: SuccessMsg.USER.count,
      driver: driverCount,
      customer: customerCount,
      rides: result,
      vehicleType: vehicleTypeCount,
      revenue: 0,
      rideStatistics: rideStatistics,
    };
  }

  async userList(args: ISearch, role: string) {
    const { page, limit, search, status } = args;
    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search && search.length > 0) {
      filterObject = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone_number: { [Op.like]: `%${search}%` } },
          { user_id: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const totalCount = await Users.count({ where: { role: role, ...filterObject } });
    const totalPage = Math.ceil(totalCount / limit);
    const users: IUser[] = await Users.findAll({
      where: { role, ...filterObject },
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    const usersWithWalletAndRatingData = await Promise.all(
      users.map(async (user) => {
        // Fetch wallet details
        const wallet = await Wallets.findOne({ where: { user: user.id }, raw: true });

        // Fetch rating details
        const ratingDetails = await Ratings.findAll({ where: { driver: user.id }, raw: true });
        let totalStars = 0;
        ratingDetails.forEach((rating) => {
          totalStars += Number(rating.stars);
        });
        const averageStars =
          ratingDetails.length > 0 ? (totalStars / ratingDetails.length).toFixed(1) : '0';

        return {
          ...user,
          wallet_amount: wallet ? wallet.amount : null,
          wallet_currency: wallet ? wallet.currency : null,
          ratings: averageStars, // Add the average rating
        };
      }),
    );

    return {
      message: SuccessMsg.USER.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      users: usersWithWalletAndRatingData,
    };
  }

  async userDetails(args: Record<string, string | Date | number | object>) {
    const user: IUser = await Users.findOne({ where: { id: args.userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    let vehicle: IVehicle | null = null;
    if (user.role === 'driver') {
      vehicle = await Vehicles.findOne({
        where: { user: args.userId },
        include: [
          {
            model: VehicleTypes,
          },
          {
            model: Category,
          },
        ],
      });
    }
    return {
      message: SuccessMsg.USER.get,
      users: user,
      vehicle: vehicle,
    };
  }

  async updateVehicle(args: Record<string, unknown>, vehicleId: string) {
    const oldVehicle = await Vehicles.findOne({
      where: { id: vehicleId },
      include: [
        {
          model: Users,
          attributes: ['name', 'email', 'user_id'],
        },
      ],
      attributes: ['documents', 'user'],
    });

    if (!oldVehicle) {
      Utils.throwError(ErrorMsg.VEHICLE.notFound);
    }

    const documents = oldVehicle.documents;
    const docIndex = documents.findIndex((doc) => doc.name === args.type);
    if (docIndex !== -1) {
      documents[docIndex].status = args.status as 'approved' | 'rejected' | 'pending';
      documents[docIndex].reason = args.reason as string;
    } else if (!args.category) {
      Utils.throwError('Document not found');
    }
    const updateObject: any = { documents };
    if (args.category) {
      updateObject.category = args.category;
      const category = await Category.findOne({ where: { id: args.category } });
      const vehicleType: IVehicleTypes = await VehicleTypes.findOne({
        where: { id: category.vehicleType },
      });
      await Users.update(
        { driver_vehicle_category: category.name, driver_vehicle_type: vehicleType.name },
        { where: { id: oldVehicle.user } },
      );
    }
    await Vehicles.update(updateObject, { where: { id: vehicleId } });

    const vehicle = await Vehicles.findOne({
      where: { id: vehicleId },
      include: [
        {
          model: Users,
        },
        {
          model: Category,
        },
      ],
    });
    const verificationStatus = Utils.checkVerification(oldVehicle.documents, vehicle.documents);

    if (verificationStatus.status === 'approved' || verificationStatus.status === 'rejected') {
      await sendDocumentVerificationMail(vehicle.User, verificationStatus);
      const user = await Users.findOne({ where: { id: oldVehicle.user } });
      if (user.fcm_token) {
        await sendDriverNotification(user, {
          type: `documents_update`,
          title: `Documents Verification Updates`,
          body: `Your vehicles documents have been ${verificationStatus.status} from admin`,
          data: { vehicle: vehicleId, notification_type: 'documents_update' },
        });
      }
    }

    if (verificationStatus.status === 'approved') {
      await vehicle.update({ verified: true, showCard: true });
    }

    const message =
      verificationStatus.status === 'approved'
        ? SuccessMsg.Vehicle.approved
        : SuccessMsg.Vehicle.rejected;

    return {
      message,
      vehicle: vehicle.get({ plain: true }),
    };
  }

  async updateUser(args: Record<string, unknown>, userId: string) {
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }

    await Users.update(args, { where: { id: userId } });
    const updatedUser = await Users.findOne({ where: { id: userId } });
    return {
      message: SuccessMsg.USER.update,
      user: updatedUser,
    };
  }
  async viewVehicle(user_id: string) {
    const vehicleDetails: IVehicle = await Vehicles.findOne({ where: { user: user_id } });
    return {
      message: SuccessMsg.Vehicle.get,
      vehicle: vehicleDetails,
    };
  }

  async getPaymentHistory(query: ISearch, userId: string) {
    const user: IUser = await Users.findOne({ where: { id: userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    const filterObject: Record<string, unknown> = { user: userId };

    console.log('filterObject with date range :', filterObject);
    const transactions: ITransaction[] = await Transactions.findAll({
      where: filterObject,
      include: [
        {
          model: Rides,
        },
      ],
      nest: true,
      raw: true,
    });

    // let subtotal = 0;
    // transactions.forEach((transaction) => {
    //   subtotal += Number(transaction.amount);
    // });

    // const average = transactions.length > 0 ? (subtotal / transactions.length).toFixed(2) : 0;

    return {
      message: SuccessMsg.PAYMENT.earningsHistory,
      transactions,
    };
  }

  async deleteUser(args: Record<string, unknown>) {
    const user = await Users.findOne({ where: { id: args.userId }, raw: true });

    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    const existWallet = await Wallets.findOne({ where: { user: args.userId } });
    if (existWallet.amount > 0) {
      Utils.throwError(ErrorMsg.USER.walletExist);
    }
    await Wallets.destroy({ where: { user: args.userId } });
    await Notifications.destroy({ where: { user: args.userId } });
    if (user.role === 'driver') {
      await Ratings.destroy({ where: { driver: args.userId } });
    } else {
      await Ratings.destroy({ where: { user: args.userId } });
    }
    await UserAddress.destroy({ where: { user: args.userId } });
    await UserLocation.destroy({ where: { user: args.userId } });
    await EmergencyContact.destroy({ where: { user_id: args.userId } });
    await Users.update(
      { deleted_at: new Date(), status: 'deleted' },
      { where: { id: args.userId } },
    );
    if (user.role === 'driver') {
      await deleteDriverRelatedData(user);
    }
    return {
      message: SuccessMsg.USER.delete,
    };
  }
})();
