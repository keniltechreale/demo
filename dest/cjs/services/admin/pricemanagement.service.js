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
const pricemanagement_model_1 = __importDefault(require("../../models/pricemanagement.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const citymanagement_model_1 = __importDefault(require("../../models/citymanagement.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const sequelize_1 = require("sequelize");
const category_model_1 = __importDefault(require("../../models/category.model"));
exports.default = new (class PriceManagementService {
    addPriceManagement(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existPrice = yield pricemanagement_model_1.default.findOne({
                where: {
                    city: args.city,
                    vehicleType: args.vehicleType,
                    vehicleCategory: args.vehicleCategory,
                },
            });
            if (existPrice) {
                Utils.throwError(constants_1.ErrorMsg.PRICES.alreadyExist);
            }
            if (args.nightCharges) {
                if (!args.nightStartTime || !args.nightEndTime) {
                    Utils.throwError(constants_1.ErrorMsg.PRICES.nightTimeRequired);
                }
            }
            const newPrice = yield pricemanagement_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.PRICES.add,
                prices: newPrice,
            };
        });
    }
    getPriceManagementById(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceDetails = yield pricemanagement_model_1.default.findOne({
                where: { id: args.priceId },
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                        as: 'VehicleTypesData',
                    },
                    {
                        model: citymanagement_model_1.default,
                        as: 'cityData',
                    },
                    {
                        model: category_model_1.default,
                        as: 'vehicleCategoryData',
                    },
                ],
            });
            if (!priceDetails) {
                Utils.throwError(constants_1.ErrorMsg.PRICES.notFound);
            }
            return {
                message: constants_1.SuccessMsg.PRICES.get,
                prices: priceDetails,
            };
        });
    }
    getAllPriceManagement(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const offset = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if (search && search.length > 0) {
                filterObject = {
                    [sequelize_1.Op.or]: [
                        { country: { [sequelize_1.Op.like]: `%${search}%` } },
                        { state: { [sequelize_1.Op.like]: `%${search}%` } },
                        { currency: { [sequelize_1.Op.like]: `%${search}%` } },
                        { currencySymbol: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield pricemanagement_model_1.default.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const pricesDetails = yield pricemanagement_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                        as: 'VehicleTypesData',
                    },
                    {
                        model: citymanagement_model_1.default,
                        as: 'cityData',
                    },
                    {
                        model: category_model_1.default,
                        as: 'vehicleCategoryData',
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset: offset,
                limit: limit,
                raw: false,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.PRICES.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                prices: pricesDetails,
            };
        });
    }
    updatePriceManagement(args, priceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceDetails = yield pricemanagement_model_1.default.findOne({
                where: { id: priceId },
            });
            if (!priceDetails) {
                Utils.throwError(constants_1.ErrorMsg.PRICES.notFound);
            }
            if (args.nightCharges) {
                if (!args.nightStartTime || !args.nightEndTime) {
                    Utils.throwError(constants_1.ErrorMsg.PRICES.nightTimeRequired);
                }
            }
            yield pricemanagement_model_1.default.update(args, {
                where: { id: priceId },
            });
            const updatedPrice = yield pricemanagement_model_1.default.findOne({
                where: { id: priceId },
            });
            return {
                message: constants_1.SuccessMsg.PRICES.update,
                prices: updatedPrice,
            };
        });
    }
    deletePriceManagement(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceDetails = yield pricemanagement_model_1.default.findOne({
                where: { id: args.priceId },
            });
            yield pricemanagement_model_1.default.destroy({
                where: { id: args.priceId },
            });
            if (!priceDetails) {
                Utils.throwError(constants_1.ErrorMsg.PRICES.notFound);
            }
            return {
                message: constants_1.SuccessMsg.PRICES.delete,
            };
        });
    }
})();
//# sourceMappingURL=pricemanagement.service.js.map