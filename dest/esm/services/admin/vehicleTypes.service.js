var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import VehicleTypes from '../../models/vehicleTypes.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { removeFilefromS3 } from '../../lib/aws.utils';
import AWSUtils from '../../config/aws.config';
import { Op } from 'sequelize';
import Category from '../../models/category.model';
import PriceManagement from '../../models/pricemanagement.model';
export default new (class VehicleTypesService {
    addVehicleTypes(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existVehicleType = yield VehicleTypes.findOne({
                where: { name: args.name },
            });
            if (existVehicleType) {
                Utils.throwError(ErrorMsg.VEHICLETYPES.alreadyExist);
            }
            const newvehicleType = yield VehicleTypes.create(args);
            return {
                message: SuccessMsg.VEHICLETYPES.add,
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
                    [Op.or]: [
                        { description: { [Op.like]: `%${search}%` } },
                        { name: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield VehicleTypes.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const vehicleTypeDetails = yield VehicleTypes.findAll({
                where: filterObject,
                order: [['createdAt', 'ASC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: SuccessMsg.VEHICLETYPES.get,
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
            const oldVehicleType = yield VehicleTypes.findOne({
                where: { id: typeId },
            });
            if (!oldVehicleType) {
                Utils.throwError(ErrorMsg.VEHICLETYPES.notFound);
            }
            yield VehicleTypes.update(args, {
                where: { id: typeId },
            });
            const updatedUser = yield VehicleTypes.findOne({ where: { id: typeId } });
            if (oldVehicleType.vehicle_image &&
                oldVehicleType.vehicle_image !== updatedUser.vehicle_image) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldVehicleType.vehicle_image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: SuccessMsg.VEHICLETYPES.update,
                vehicletype: updatedUser,
            };
        });
    }
    deleteVehicleTypes(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const vehicleTypeDetails = yield VehicleTypes.findOne({
                where: { id: args.typeId },
            });
            if (!vehicleTypeDetails) {
                Utils.throwError(ErrorMsg.VEHICLETYPES.notFound);
            }
            const PriceDependencyCount = yield PriceManagement.count({
                where: { vehicleType: args.typeId },
            });
            if (PriceDependencyCount > 0) {
                Utils.throwError(ErrorMsg.CATEGORY.priceDependency);
            }
            const CategoryDependencyCount = yield Category.count({
                where: { vehicleType: args.typeId },
            });
            if (CategoryDependencyCount > 0) {
                Utils.throwError(ErrorMsg.CATEGORY.categoryDependency);
            }
            yield VehicleTypes.destroy({
                where: { id: args.typeId },
            });
            return {
                message: SuccessMsg.VEHICLETYPES.delete,
            };
        });
    }
})();
//# sourceMappingURL=vehicleTypes.service.js.map