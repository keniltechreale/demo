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
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const users_model_1 = __importDefault(require("../../models/users.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const sequelize_1 = require("sequelize");
exports.default = new (class RidesServices {
    updateRides(args, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            let rides = yield rides_model_1.default.findOne({ where: { id: orderId } });
            if (!rides_model_1.default) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            yield rides_model_1.default.update(args, { where: { id: orderId } });
            rides = yield rides_model_1.default.findOne({ where: { id: orderId } });
            return {
                message: constants_1.SuccessMsg.RIDES.updated,
                rides: rides,
            };
        });
    }
    getRides(rideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const ridesDetails = yield rides_model_1.default.findOne({
                where: { id: rideId },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
                        as: 'passenger',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                ],
            });
            if (!ridesDetails) {
                Utils.throwError(constants_1.ErrorMsg.RIDES.notFound);
            }
            return {
                message: constants_1.SuccessMsg.RIDES.get,
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
                    [sequelize_1.Op.or]: [
                        { origin: { [sequelize_1.Op.like]: `%${search}%` } },
                        { destination: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield rides_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ridesDetails = yield rides_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
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
                message: constants_1.SuccessMsg.RIDES.get,
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
                    [sequelize_1.Op.or]: [
                        { origin: { [sequelize_1.Op.like]: `%${search}%` } },
                        { destination: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield rides_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ridesDetails = yield rides_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                    {
                        model: users_model_1.default,
                        as: 'driver',
                        attributes: ['name', 'email', 'profile_picture', 'country_code', 'phone_number'],
                    },
                    {
                        model: users_model_1.default,
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
                message: constants_1.SuccessMsg.RIDES.get,
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