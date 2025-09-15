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
const sequelize_1 = __importStar(require("sequelize"));
const vehicle_model_1 = __importDefault(require("../../models/vehicle.model"));
const Utils = __importStar(require("../../lib/utils"));
const users_model_1 = __importDefault(require("../../models/users.model"));
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const constants_1 = require("../../lib/constants");
const helpFunctions_1 = require("../../lib/helpFunctions");
const email_utils_1 = require("../../lib/email.utils");
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const category_model_1 = __importDefault(require("../../models/category.model"));
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
const notifications_utils_1 = require("../../lib/notifications.utils");
const wallet_model_1 = __importDefault(require("../../models/wallet.model"));
const emergencycontact_model_1 = __importDefault(require("../../models/emergencycontact.model"));
const ratings_model_1 = __importDefault(require("../../models/ratings.model"));
const useraddress_model_1 = __importDefault(require("../../models/useraddress.model"));
const userlocation_model_1 = __importDefault(require("../../models/userlocation.model"));
const transaction_model_1 = __importDefault(require("../../models/transaction.model"));
exports.default = new (class UsersService {
    addDriver(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existUser = yield users_model_1.default.findOne({
                where: {
                    country_code: args.country_code,
                    phone_number: args.phone_number,
                },
            });
            if (existUser) {
                Utils.throwError(constants_1.ErrorMsg.USER.phoneAlreadyExist);
            }
            const existEmail = yield users_model_1.default.findOne({
                where: { email: args.email },
            });
            if (existEmail) {
                Utils.throwError(constants_1.ErrorMsg.USER.emailAlreadyExist);
            }
            const uniqueUserId = yield (0, helpFunctions_1.generateUniqueID)(`IND`);
            const newUser = yield users_model_1.default.create(Object.assign({ user_id: uniqueUserId }, args));
            return {
                message: constants_1.SuccessMsg.USER.register,
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
            const driverCount = yield users_model_1.default.count({ where: { role: 'driver' } });
            const customerCount = yield users_model_1.default.count({ where: { role: 'customer' } });
            const ridesCount = yield rides_model_1.default.count();
            const statusCounts = yield rides_model_1.default.findAll({
                attributes: ['status', [sequelize_1.default.fn('COUNT', sequelize_1.default.col('status')), 'count']],
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
            const rideStatistics = yield rides_model_1.default.findAll({
                attributes: [
                    [sequelize_1.default.fn('MONTH', sequelize_1.default.col('date')), 'month'],
                    [sequelize_1.default.literal(`SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END)`), 'bookedCount'],
                    [
                        sequelize_1.default.literal(`SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END)`),
                        'cancelledCount',
                    ],
                    [
                        sequelize_1.default.literal(`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`),
                        'completedCount',
                    ],
                    [sequelize_1.default.fn('COUNT', sequelize_1.default.col('*')), 'totalCount'], // Total count of rides in the month
                ],
                where: {
                    date: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
                group: [sequelize_1.default.fn('MONTH', sequelize_1.default.col('date'))],
                order: [[sequelize_1.default.fn('MONTH', sequelize_1.default.col('date')), 'ASC']],
                raw: true,
            });
            const vehicleTypeCount = yield vehicleTypes_model_1.default.count();
            return {
                message: constants_1.SuccessMsg.USER.count,
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
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { email: { [sequelize_1.Op.like]: `%${search}%` } },
                        { phone_number: { [sequelize_1.Op.like]: `%${search}%` } },
                        { user_id: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield users_model_1.default.count({ where: Object.assign({ role: role }, filterObject) });
            const totalPage = Math.ceil(totalCount / limit);
            const users = yield users_model_1.default.findAll({
                where: Object.assign({ role }, filterObject),
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            const usersWithWalletAndRatingData = yield Promise.all(users.map((user) => __awaiter(this, void 0, void 0, function* () {
                // Fetch wallet details
                const wallet = yield wallet_model_1.default.findOne({ where: { user: user.id }, raw: true });
                // Fetch rating details
                const ratingDetails = yield ratings_model_1.default.findAll({ where: { driver: user.id }, raw: true });
                let totalStars = 0;
                ratingDetails.forEach((rating) => {
                    totalStars += Number(rating.stars);
                });
                const averageStars = ratingDetails.length > 0 ? (totalStars / ratingDetails.length).toFixed(1) : '0';
                return Object.assign(Object.assign({}, user), { wallet_amount: wallet ? wallet.amount : null, wallet_currency: wallet ? wallet.currency : null, ratings: averageStars });
            })));
            return {
                message: constants_1.SuccessMsg.USER.get,
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
            const user = yield users_model_1.default.findOne({ where: { id: args.userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            let vehicle = null;
            if (user.role === 'driver') {
                vehicle = yield vehicle_model_1.default.findOne({
                    where: { user: args.userId },
                    include: [
                        {
                            model: vehicleTypes_model_1.default,
                        },
                        {
                            model: category_model_1.default,
                        },
                    ],
                });
            }
            return {
                message: constants_1.SuccessMsg.USER.get,
                users: user,
                vehicle: vehicle,
            };
        });
    }
    updateVehicle(args, vehicleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldVehicle = yield vehicle_model_1.default.findOne({
                where: { id: vehicleId },
                include: [
                    {
                        model: users_model_1.default,
                        attributes: ['name', 'email', 'user_id'],
                    },
                ],
                attributes: ['documents', 'user'],
            });
            if (!oldVehicle) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLE.notFound);
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
                const category = yield category_model_1.default.findOne({ where: { id: args.category } });
                const vehicleType = yield vehicleTypes_model_1.default.findOne({
                    where: { id: category.vehicleType },
                });
                yield users_model_1.default.update({ driver_vehicle_category: category.name, driver_vehicle_type: vehicleType.name }, { where: { id: oldVehicle.user } });
            }
            yield vehicle_model_1.default.update(updateObject, { where: { id: vehicleId } });
            const vehicle = yield vehicle_model_1.default.findOne({
                where: { id: vehicleId },
                include: [
                    {
                        model: users_model_1.default,
                    },
                    {
                        model: category_model_1.default,
                    },
                ],
            });
            const verificationStatus = Utils.checkVerification(oldVehicle.documents, vehicle.documents);
            if (verificationStatus.status === 'approved' || verificationStatus.status === 'rejected') {
                yield (0, email_utils_1.sendDocumentVerificationMail)(vehicle.User, verificationStatus);
                const user = yield users_model_1.default.findOne({ where: { id: oldVehicle.user } });
                if (user.fcm_token) {
                    yield (0, notifications_utils_1.sendDriverNotification)(user, {
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
                ? constants_1.SuccessMsg.Vehicle.approved
                : constants_1.SuccessMsg.Vehicle.rejected;
            return {
                message,
                vehicle: vehicle.get({ plain: true }),
            };
        });
    }
    updateUser(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            yield users_model_1.default.update(args, { where: { id: userId } });
            const updatedUser = yield users_model_1.default.findOne({ where: { id: userId } });
            return {
                message: constants_1.SuccessMsg.USER.update,
                user: updatedUser,
            };
        });
    }
    viewVehicle(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleDetails = yield vehicle_model_1.default.findOne({ where: { user: user_id } });
            return {
                message: constants_1.SuccessMsg.Vehicle.get,
                vehicle: vehicleDetails,
            };
        });
    }
    getPaymentHistory(query, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: userId } });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            const filterObject = { user: userId };
            console.log('filterObject with date range :', filterObject);
            const transactions = yield transaction_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: rides_model_1.default,
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
                message: constants_1.SuccessMsg.PAYMENT.earningsHistory,
                transactions,
            };
        });
    }
    deleteUser(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({ where: { id: args.userId }, raw: true });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            const existWallet = yield wallet_model_1.default.findOne({ where: { user: args.userId } });
            if (existWallet.amount > 0) {
                Utils.throwError(constants_1.ErrorMsg.USER.walletExist);
            }
            yield wallet_model_1.default.destroy({ where: { user: args.userId } });
            yield notifications_model_1.default.destroy({ where: { user: args.userId } });
            if (user.role === 'driver') {
                yield ratings_model_1.default.destroy({ where: { driver: args.userId } });
            }
            else {
                yield ratings_model_1.default.destroy({ where: { user: args.userId } });
            }
            yield useraddress_model_1.default.destroy({ where: { user: args.userId } });
            yield userlocation_model_1.default.destroy({ where: { user: args.userId } });
            yield emergencycontact_model_1.default.destroy({ where: { user_id: args.userId } });
            yield users_model_1.default.update({ deleted_at: new Date(), status: 'deleted' }, { where: { id: args.userId } });
            if (user.role === 'driver') {
                yield (0, helpFunctions_1.deleteDriverRelatedData)(user);
            }
            return {
                message: constants_1.SuccessMsg.USER.delete,
            };
        });
    }
})();
//# sourceMappingURL=userdetails.service.js.map