var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import CityManagement from '../../models/citymanagement.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
import Document from '../../models/documents.model';
import VehicleCategory from '../../models/vehicleTypes.model';
import PriceManagement from '../../models/pricemanagement.model';
export default new (class CityService {
    addCity(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existCity = yield CityManagement.findOne({
                where: { city: args.city },
            });
            if (existCity) {
                Utils.throwError(ErrorMsg.CITY.alreadyExist);
            }
            const newCity = yield CityManagement.create(args);
            return {
                message: SuccessMsg.CITY.add,
                city: newCity,
            };
        });
    }
    getAllCity(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (search && search.length > 0) {
                filterObject = {
                    [Op.or]: [
                        { country: { [Op.like]: `%${search}%` } },
                        { state: { [Op.like]: `%${search}%` } },
                        { city: { [Op.like]: `%${search}%` } },
                        { currency: { [Op.like]: `%${search}%` } },
                        { code: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            if (status) {
                filterObject.status = status;
            }
            const totalCount = yield CityManagement.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const cityDetails = yield CityManagement.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            const vehicleIds = cityDetails.flatMap((city) => city.vehicleTypes);
            const documentIds = cityDetails.flatMap((city) => city.documents);
            const vehicles = yield VehicleCategory.findAll({
                where: { id: vehicleIds },
                raw: true,
            });
            const documents = yield Document.findAll({
                where: { id: documentIds },
                raw: true,
            });
            let vehicleMap = vehicles.reduce((acc, vehicle) => {
                acc[vehicle.id] = vehicle;
                return acc;
            }, {});
            let documentMap = documents.reduce((acc, document) => {
                acc[document.id] = document;
                return acc;
            }, {});
            let filteredVehicleMap = Object.fromEntries(Object.entries(vehicleMap).filter(([key, value]) => value !== null));
            let filteredDocumentMap = Object.fromEntries(Object.entries(documentMap).filter(([key, value]) => value !== null));
            const detailedCityDetails = cityDetails.map((city) => {
                return Object.assign(Object.assign({}, city), { vehicleTypes: city.vehicleTypes.map((id) => filteredVehicleMap[id]), documents: city.documents.map((id) => filteredDocumentMap[id]) });
            });
            return {
                message: SuccessMsg.CITY.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                city: detailedCityDetails,
            };
        });
    }
    updateCity(args, cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(cityId);
            const cityDetails = yield CityManagement.findOne({
                where: { id: id },
            });
            if (!cityDetails) {
                Utils.throwError(ErrorMsg.CITY.notFound);
            }
            yield CityManagement.update(args, {
                where: { id: id },
            });
            const updatedCity = yield CityManagement.findOne({
                where: { id: id },
            });
            return {
                message: SuccessMsg.CITY.update,
                city: updatedCity,
            };
        });
    }
    deleteCity(cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(cityId);
            const cityDetails = yield CityManagement.findOne({
                where: { id: id },
            });
            const PriceDependencyCount = yield PriceManagement.count({
                where: { city: id },
            });
            if (PriceDependencyCount > 0) {
                Utils.throwError(ErrorMsg.CITY.priceDependency);
            }
            if (!cityDetails) {
                Utils.throwError(ErrorMsg.CITY.notFound);
            }
            yield CityManagement.destroy({
                where: { id: id },
            });
            return {
                message: SuccessMsg.CITY.delete,
            };
        });
    }
})();
//# sourceMappingURL=citymanagement.service.js.map