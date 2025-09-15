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
const users_model_1 = __importDefault(require("../../models/users.model"));
const sequelize_1 = require("sequelize");
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const cashoutRequest_model_1 = __importDefault(require("../../models/cashoutRequest.model"));
exports.default = new (class ExportFilesService {
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
                    filterObject = Object.assign(Object.assign({}, filterObject), { [sequelize_1.Op.or]: fields.map((field) => ({
                            [field]: { [sequelize_1.Op.like]: `%${search}%` },
                        })) });
                }
            };
            switch (type) {
                case 'driver':
                case 'customer':
                    filterObject.role = type;
                    addSearchFilters(['name', 'last_name', 'email', 'phone_number', 'user_id']);
                    totalCount = yield users_model_1.default.count({ where: filterObject });
                    totalPage = limit ? Math.ceil(totalCount / limit) : 1;
                    details = yield users_model_1.default.findAll({
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
                    totalCount = yield rides_model_1.default.count({ where: filterObject });
                    totalPage = limit ? Math.ceil(totalCount / limit) : 1;
                    details = yield rides_model_1.default.findAll({
                        where: filterObject,
                        order: [['createdAt', 'DESC']],
                        offset: limit && page ? skip : undefined,
                        limit: limit || undefined,
                        raw: true,
                    });
                    break;
                case 'cashout':
                    if (search && search.length > 0) {
                        filterObject['$or'] = [{ amount: { [sequelize_1.Op.like]: `%${search}%` } }];
                    }
                    totalCount = yield cashoutRequest_model_1.default.count({ where: filterObject });
                    totalPage = limit ? Math.ceil(totalCount / limit) : 1;
                    details = yield cashoutRequest_model_1.default.findAll({
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