var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Sequelize, { Op } from 'sequelize';
import Vehicles from '../../models/vehicle.model';
import * as Utils from '../../lib/utils';
import Users from '../../models/users.model';
import Rides from '../../models/rides.model';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { deleteDriverRelatedData, generateUniqueID } from '../../lib/helpFunctions';
import { sendDocumentVerificationMail } from '../../lib/email.utils';
import VehicleTypes from '../../models/vehicleTypes.model';
import Category from '../../models/category.model';
import Notifications from '../../models/notifications.model';
import { sendDriverNotification } from '../../lib/notifications.utils';
import Wallets from '../../models/wallet.model';
import EmergencyContact from '../../models/emergencycontact.model';
import Ratings from '../../models/ratings.model';
import UserAddress from '../../models/useraddress.model';
import UserLocation from '../../models/userlocation.model';
import Transactions from '../../models/transaction.model';
export default new (class UsersService {
    addDriver(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield Users.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                },
            });
            if (existUser) {
                Utils.throwError(ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield Users.findOne({
                where: { email: args.email },
            });
            if (existEmail) {
                Utils.throwError(ErrorMsg.USER.emailAlreadyExist);
            }
            const uniqueUserId = yield generateUniqueID(`IND`);
            const newUser = yield Users.create(Object.assign({ user_id: uniqueUserId }, args));
            return {
                message: SuccessMsg.USER.register,
                user: newUser,
            };
        });
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
    userCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const year = '2024';
            const driverCount = yield Users.count({ where: { role: 'driver' } });
            const customerCount = yield Users.count({ where: { role: 'customer' } });
            const ridesCount = yield Rides.count();
            const statusCounts = yield Rides.findAll({
                attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
                group: 'status',
                raw: true,
            });
            const initialAccumulator = {};
            const result = Object.assign({ total: ridesCount }, statusCounts.reduce((acc, item) => {
                acc[item.status] = item.count;
                return acc;
            }, initialAccumulator));
            const startDate = new Date(`${year}-01-01`);
            const endDate = new Date(`${year}-12-31`);
            const rideStatistics = yield Rides.findAll({
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
            const vehicleTypeCount = yield VehicleTypes.count();
            return {
                message: SuccessMsg.USER.count,
                driver: driverCount,
                customer: customerCount,
                rides: result,
                vehicleType: vehicleTypeCount,
                revenue: 0,
                rideStatistics: rideStatistics,
            };
        });
    }
    userList(args, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = args;
            const skip = (page - 1) * limit;
            let filterObject = {};
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
            const totalCount = yield Users.count({ where: Object.assign({ role: role }, filterObject) });
            const totalPage = Math.ceil(totalCount / limit);
            const users = yield Users.findAll({
                where: Object.assign({ role }, filterObject),
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            const usersWithWalletAndRatingData = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                // Fetch wallet details
                const wallet = yield Wallets.findOne({ where: { user: user.id }, raw: true });
                // Fetch rating details
                const ratingDetails = yield Ratings.findAll({ where: { driver: user.id }, raw: true });
                let totalStars = 0;
                ratingDetails.forEach((rating) => {
                    totalStars += Number(rating.stars);
                });
                const averageStars = ratingDetails.length > 0 ? (totalStars / ratingDetails.length).toFixed(1) : '0';
                return Object.assign(Object.assign({}, user), { wallet_amount: wallet ? wallet.amount : null, wallet_currency: wallet ? wallet.currency : null, ratings: averageStars });
            })));
            return {
                message: SuccessMsg.USER.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                users: usersWithWalletAndRatingData,
            };
        });
    }
    userDetails(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: args.userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            let vehicle = null;
            if (user.role === 'driver') {
                vehicle = yield Vehicles.findOne({
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
        });
    }
    updateVehicle(args, vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldVehicle = yield Vehicles.findOne({
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
                documents[docIndex].status = args.status;
                documents[docIndex].reason = args.reason;
            }
            else if (!args.category) {
                Utils.throwError('Document not found');
            }
            const updateObject = { documents };
            if (args.category) {
                updateObject.category = args.category;
                const category = yield Category.findOne({ where: { id: args.category } });
                const vehicleType = yield VehicleTypes.findOne({
                    where: { id: category.vehicleType },
                });
                yield Users.update({ driver_vehicle_category: category.name, driver_vehicle_type: vehicleType.name }, { where: { id: oldVehicle.user } });
            }
            yield Vehicles.update(updateObject, { where: { id: vehicleId } });
            const vehicle = yield Vehicles.findOne({
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
                yield sendDocumentVerificationMail(vehicle.User, verificationStatus);
                const user = yield Users.findOne({ where: { id: oldVehicle.user } });
                if (user.fcm_token) {
                    yield sendDriverNotification(user, {
                        type: `documents_update`,
                        title: `Documents Verification Updates`,
                        body: `Your vehicles documents have been ${verificationStatus.status} from admin`,
                        data: { vehicle: vehicleId, notification_type: 'documents_update' },
                    });
                }
            }
            if (verificationStatus.status === 'approved') {
                yield vehicle.update({ verified: true, showCard: true });
            }
            const message = verificationStatus.status === 'approved'
                ? SuccessMsg.Vehicle.approved
                : SuccessMsg.Vehicle.rejected;
            return {
                message,
                vehicle: vehicle.get({ plain: true }),
            };
        });
    }
    updateUser(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            yield Users.update(args, { where: { id: userId } });
            const updatedUser = yield Users.findOne({ where: { id: userId } });
            return {
                message: SuccessMsg.USER.update,
                user: updatedUser,
            };
        });
    }
    viewVehicle(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield Vehicles.findOne({ where: { user: user_id } });
            return {
                message: SuccessMsg.Vehicle.get,
                vehicle: vehicleDetails,
            };
        });
    }
    getPaymentHistory(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            const filterObject = { user: userId };
            console.log('filterObject with date range :', filterObject);
            const transactions = yield Transactions.findAll({
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
        });
    }
    deleteUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({ where: { id: args.userId }, raw: true });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            const existWallet = yield Wallets.findOne({ where: { user: args.userId } });
            if (existWallet.amount > 0) {
                Utils.throwError(ErrorMsg.USER.walletExist);
            }
            yield Wallets.destroy({ where: { user: args.userId } });
            yield Notifications.destroy({ where: { user: args.userId } });
            if (user.role === 'driver') {
                yield Ratings.destroy({ where: { driver: args.userId } });
            }
            else {
                yield Ratings.destroy({ where: { user: args.userId } });
            }
            yield UserAddress.destroy({ where: { user: args.userId } });
            yield UserLocation.destroy({ where: { user: args.userId } });
            yield EmergencyContact.destroy({ where: { user_id: args.userId } });
            yield Users.update({ deleted_at: new Date(), status: 'deleted' }, { where: { id: args.userId } });
            if (user.role === 'driver') {
                yield deleteDriverRelatedData(user);
            }
            return {
                message: SuccessMsg.USER.delete,
            };
        });
    }
})();
//# sourceMappingURL=userdetails.service.js.map