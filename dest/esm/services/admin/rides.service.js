var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Rides from '../../models/rides.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Users from '../../models/users.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';
export default new (class RidesServices {
    updateRides(args, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            let rides = yield Rides.findOne({ where: { id: orderId } });
            if (!Rides) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            yield Rides.update(args, { where: { id: orderId } });
            rides = yield Rides.findOne({ where: { id: orderId } });
            return {
                message: SuccessMsg.RIDES.updated,
                rides: rides,
            };
        });
    }
    getRides(rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ridesDetails = yield Rides.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                ],
            });
            if (!ridesDetails) {
                Utils.throwError(ErrorMsg.RIDES.notFound);
            }
            return {
                message: SuccessMsg.RIDES.get,
                rides: ridesDetails,
            };
        });
    }
    getAllRides(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if (search && search.length > 0) {
                filterObject = {
                    [Op.or]: [
                        { origin: { [Op.like]: `%${search}%` } },
                        { destination: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Rides.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ridesDetails = yield Rides.findAll({
                where: filterObject,
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: false,
                nest: true,
            });
            return {
                message: SuccessMsg.RIDES.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                rides: ridesDetails,
            };
        });
    }
    getHistoryRides(arg, userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (role === 'driver') {
                filterObject.driverId = userId;
            }
            else if (role === 'customer') {
                filterObject.passengerId = userId;
            }
            if (status) {
                filterObject.status = status;
            }
            if (search && search.length > 0) {
                filterObject = {
                    [Op.or]: [
                        { origin: { [Op.like]: `%${search}%` } },
                        { destination: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Rides.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ridesDetails = yield Rides.findAll({
                where: filterObject,
                include: [
                    {
                        model: VehicleTypes,
                    },
                    {
                        model: Users,
                        as: 'driver',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: Users,
                        as: 'passenger',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: false,
                nest: true,
            });
            return {
                message: SuccessMsg.RIDES.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                rides: ridesDetails,
            };
        });
    }
})();
//# sourceMappingURL=rides.service.js.map