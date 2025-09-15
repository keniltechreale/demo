var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PriceManagement from '../../models/pricemanagement.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import CityManagement from '../../models/citymanagement.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';
import Category from '../../models/category.model';
export default new (class PriceManagementService {
    addPriceManagement(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existPrice = yield PriceManagement.findOne({
                where: {
                    city: args.city,
                    vehicleType: args.vehicleType,
                    vehicleCategory: args.vehicleCategory,
                },
            });
            if (existPrice) {
                Utils.throwError(ErrorMsg.PRICES.alreadyExist);
            }
            if (args.nightCharges) {
                if (!args.nightStartTime || !args.nightEndTime) {
                    Utils.throwError(ErrorMsg.PRICES.nightTimeRequired);
                }
            }
            const newPrice = yield PriceManagement.create(args);
            return {
                message: SuccessMsg.PRICES.add,
                prices: newPrice,
            };
        });
    }
    getPriceManagementById(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceDetails = yield PriceManagement.findOne({
                where: { id: args.priceId },
                include: [
                    {
                        model: VehicleTypes,
                        as: 'VehicleTypesData',
                    },
                    {
                        model: CityManagement,
                        as: 'cityData',
                    },
                    {
                        model: Category,
                        as: 'vehicleCategoryData',
                    },
                ],
            });
            if (!priceDetails) {
                Utils.throwError(ErrorMsg.PRICES.notFound);
            }
            return {
                message: SuccessMsg.PRICES.get,
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
                    [Op.or]: [
                        { country: { [Op.like]: `%${search}%` } },
                        { state: { [Op.like]: `%${search}%` } },
                        { currency: { [Op.like]: `%${search}%` } },
                        { currencySymbol: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield PriceManagement.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const pricesDetails = yield PriceManagement.findAll({
                where: filterObject,
                include: [
                    {
                        model: VehicleTypes,
                        as: 'VehicleTypesData',
                    },
                    {
                        model: CityManagement,
                        as: 'cityData',
                    },
                    {
                        model: Category,
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
                message: SuccessMsg.PRICES.get,
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
            const priceDetails = yield PriceManagement.findOne({
                where: { id: priceId },
            });
            if (!priceDetails) {
                Utils.throwError(ErrorMsg.PRICES.notFound);
            }
            if (args.nightCharges) {
                if (!args.nightStartTime || !args.nightEndTime) {
                    Utils.throwError(ErrorMsg.PRICES.nightTimeRequired);
                }
            }
            yield PriceManagement.update(args, {
                where: { id: priceId },
            });
            const updatedPrice = yield PriceManagement.findOne({
                where: { id: priceId },
            });
            return {
                message: SuccessMsg.PRICES.update,
                prices: updatedPrice,
            };
        });
    }
    deletePriceManagement(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const priceDetails = yield PriceManagement.findOne({
                where: { id: args.priceId },
            });
            yield PriceManagement.destroy({
                where: { id: args.priceId },
            });
            if (!priceDetails) {
                Utils.throwError(ErrorMsg.PRICES.notFound);
            }
            return {
                message: SuccessMsg.PRICES.delete,
            };
        });
    }
})();
//# sourceMappingURL=pricemanagement.service.js.map