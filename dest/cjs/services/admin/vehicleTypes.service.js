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
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const aws_utils_1 = require("../../lib/aws.utils");
const aws_config_1 = __importDefault(require("../../config/aws.config"));
const sequelize_1 = require("sequelize");
const category_model_1 = __importDefault(require("../../models/category.model"));
const pricemanagement_model_1 = __importDefault(require("../../models/pricemanagement.model"));
exports.default = new (class VehicleTypesService {
    addVehicleTypes(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existVehicleType = yield vehicleTypes_model_1.default.findOne({
                where: { name: args.name },
            });
            if (existVehicleType) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLETYPES.alreadyExist);
            }
            const newvehicleType = yield vehicleTypes_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.VEHICLETYPES.add,
                vehicletype: newvehicleType,
            };
        });
    }
    getAllVehicleTypes(arg) {
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
                        { description: { [sequelize_1.Op.like]: `%${search}%` } },
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield vehicleTypes_model_1.default.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const vehicleTypeDetails = yield vehicleTypes_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'ASC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.VEHICLETYPES.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                vehicletype: vehicleTypeDetails,
            };
        });
    }
    updateVehicleTypes(args, typeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldVehicleType = yield vehicleTypes_model_1.default.findOne({
                where: { id: typeId },
            });
            if (!oldVehicleType) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLETYPES.notFound);
            }
            yield vehicleTypes_model_1.default.update(args, {
                where: { id: typeId },
            });
            const updatedUser = yield vehicleTypes_model_1.default.findOne({ where: { id: typeId } });
            if (oldVehicleType.vehicle_image &&
                oldVehicleType.vehicle_image !== updatedUser.vehicle_image) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: oldVehicleType.vehicle_image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: constants_1.SuccessMsg.VEHICLETYPES.update,
                vehicletype: updatedUser,
            };
        });
    }
    deleteVehicleTypes(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleTypeDetails = yield vehicleTypes_model_1.default.findOne({
                where: { id: args.typeId },
            });
            if (!vehicleTypeDetails) {
                Utils.throwError(constants_1.ErrorMsg.VEHICLETYPES.notFound);
            }
            const PriceDependencyCount = yield pricemanagement_model_1.default.count({
                where: { vehicleType: args.typeId },
            });
            if (PriceDependencyCount > 0) {
                Utils.throwError(constants_1.ErrorMsg.CATEGORY.priceDependency);
            }
            const CategoryDependencyCount = yield category_model_1.default.count({
                where: { vehicleType: args.typeId },
            });
            if (CategoryDependencyCount > 0) {
                Utils.throwError(constants_1.ErrorMsg.CATEGORY.categoryDependency);
            }
            yield vehicleTypes_model_1.default.destroy({
                where: { id: args.typeId },
            });
            return {
                message: constants_1.SuccessMsg.VEHICLETYPES.delete,
            };
        });
    }
})();
//# sourceMappingURL=vehicleTypes.service.js.map