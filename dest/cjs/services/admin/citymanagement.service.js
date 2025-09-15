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
const citymanagement_model_1 = __importDefault(require("../../models/citymanagement.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const sequelize_1 = require("sequelize");
const documents_model_1 = __importDefault(require("../../models/documents.model"));
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const pricemanagement_model_1 = __importDefault(require("../../models/pricemanagement.model"));
exports.default = new (class CityService {
    addCity(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existCity = yield citymanagement_model_1.default.findOne({
                where: { city: args.city },
            });
            if (existCity) {
                Utils.throwError(constants_1.ErrorMsg.CITY.alreadyExist);
            }
            const newCity = yield citymanagement_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.CITY.add,
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
                    [sequelize_1.Op.or]: [
                        { country: { [sequelize_1.Op.like]: `%${search}%` } },
                        { state: { [sequelize_1.Op.like]: `%${search}%` } },
                        { city: { [sequelize_1.Op.like]: `%${search}%` } },
                        { currency: { [sequelize_1.Op.like]: `%${search}%` } },
                        { code: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            if (status) {
                filterObject.status = status;
            }
            const totalCount = yield citymanagement_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const cityDetails = yield citymanagement_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            const vehicleIds = cityDetails.flatMap((city) => city.vehicleTypes);
            const documentIds = cityDetails.flatMap((city) => city.documents);
            const vehicles = yield vehicleTypes_model_1.default.findAll({
                where: { id: vehicleIds },
                raw: true,
            });
            const documents = yield documents_model_1.default.findAll({
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
                message: constants_1.SuccessMsg.CITY.get,
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
            const cityDetails = yield citymanagement_model_1.default.findOne({
                where: { id: id },
            });
            if (!cityDetails) {
                Utils.throwError(constants_1.ErrorMsg.CITY.notFound);
            }
            yield citymanagement_model_1.default.update(args, {
                where: { id: id },
            });
            const updatedCity = yield citymanagement_model_1.default.findOne({
                where: { id: id },
            });
            return {
                message: constants_1.SuccessMsg.CITY.update,
                city: updatedCity,
            };
        });
    }
    deleteCity(cityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(cityId);
            const cityDetails = yield citymanagement_model_1.default.findOne({
                where: { id: id },
            });
            const PriceDependencyCount = yield pricemanagement_model_1.default.count({
                where: { city: id },
            });
            if (PriceDependencyCount > 0) {
                Utils.throwError(constants_1.ErrorMsg.CITY.priceDependency);
            }
            if (!cityDetails) {
                Utils.throwError(constants_1.ErrorMsg.CITY.notFound);
            }
            yield citymanagement_model_1.default.destroy({
                where: { id: id },
            });
            return {
                message: constants_1.SuccessMsg.CITY.delete,
            };
        });
    }
})();
//# sourceMappingURL=citymanagement.service.js.map