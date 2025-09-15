var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Users from '../../models/users.model';
import { Op } from 'sequelize';
import Ride from '../../models/rides.model';
import CashoutRequests from '../../models/cashoutRequest.model';
export default new (class ExportFilesService {
    exportCSVFiles(arg, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            let totalCount = 0;
            let totalPage = 0;
            let details = [];
            if (status) {
                filterObject.status = status;
            }
            // Common search logic
            const addSearchFilters = (fields) => {
                if (search && search.length > 0) {
                    filterObject = Object.assign(Object.assign({}, filterObject), { [Op.or]: fields.map((field) => ({
                            [field]: { [Op.like]: `%${search}%` },
                        })) });
                }
            };
            switch (type) {
                case 'driver':
                case 'customer':
                    filterObject.role = type;
                    addSearchFilters(['name', 'last_name', 'email', 'phone_number', 'user_id']);
                    totalCount = yield Users.count({ where: filterObject });
                    totalPage = limit ? Math.ceil(totalCount / limit) : 1;
                    details = yield Users.findAll({
                        where: filterObject,
                        attributes: {
                            exclude: [
                                'mpin',
                                'profile_picture',
                                'ongoing_rides',
                                'driver_available',
                                'fcm_token',
                                'createdAt',
                                'updatedAt',
                            ],
                        },
                        order: [['createdAt', 'DESC']],
                        offset: limit && page ? skip : undefined,
                        limit: limit || undefined,
                        raw: true,
                    });
                    break;
                case 'rides':
                    addSearchFilters(['origin', 'destination']);
                    totalCount = yield Ride.count({ where: filterObject });
                    totalPage = limit ? Math.ceil(totalCount / limit) : 1;
                    details = yield Ride.findAll({
                        where: filterObject,
                        order: [['createdAt', 'DESC']],
                        offset: limit && page ? skip : undefined,
                        limit: limit || undefined,
                        raw: true,
                    });
                    break;
                case 'cashout':
                    if (search && search.length > 0) {
                        filterObject['$or'] = [{ amount: { [Op.like]: `%${search}%` } }];
                    }
                    totalCount = yield CashoutRequests.count({ where: filterObject });
                    totalPage = limit ? Math.ceil(totalCount / limit) : 1;
                    details = yield CashoutRequests.findAll({
                        where: filterObject,
                        order: [['createdAt', 'DESC']],
                        offset: limit && page ? skip : undefined,
                        limit: limit || undefined,
                        raw: true,
                    });
                    break;
                default:
                    throw new Error('Invalid type specified');
            }
            return {
                page,
                perPage: limit || totalCount,
                totalCount,
                totalPage,
                details: details || [],
            };
        });
    }
})();
0;
//# sourceMappingURL=exportFile.service.js.map