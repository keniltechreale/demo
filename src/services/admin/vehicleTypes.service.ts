import VehicleTypes, { IVehicleTypes } from '../../models/vehicleTypes.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { removeFilefromS3 } from '../../lib/aws.utils';
import AWSUtils from '../../config/aws.config';
import { Op, Sequelize } from 'sequelize';
import Category from '../../models/category.model';
import PriceManagement from '../../models/pricemanagement.model';
import CityManagement from '../../models/citymanagement.model';

export default new (class VehicleTypesService {
  async addVehicleTypes(args: Record<string, unknown>) {
    const existVehicleType: IVehicleTypes = await VehicleTypes.findOne({
      where: { name: args.name },
    });
    if (existVehicleType) {
      Utils.throwError(ErrorMsg.VEHICLETYPES.alreadyExist);
    }
    const newvehicleType: IVehicleTypes = await VehicleTypes.create(args);

    return {
      message: SuccessMsg.VEHICLETYPES.add,
      vehicletype: newvehicleType,
    };
  }

  async getAllVehicleTypes(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
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

    const totalCount = await VehicleTypes.count(filterObject);
    const totalPage = Math.ceil(totalCount / limit);
    const vehicleTypeDetails = await VehicleTypes.findAll({
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
  }

  async updateVehicleTypes(args: Record<string, unknown>, typeId: string) {
    const oldVehicleType: IVehicleTypes = await VehicleTypes.findOne({
      where: { id: typeId },
    });
    if (!oldVehicleType) {
      Utils.throwError(ErrorMsg.VEHICLETYPES.notFound);
    }
    await VehicleTypes.update(args, {
      where: { id: typeId },
    });
    const updatedUser: IVehicleTypes = await VehicleTypes.findOne({ where: { id: typeId } });

    if (
      oldVehicleType.vehicle_image &&
      oldVehicleType.vehicle_image !== updatedUser.vehicle_image
    ) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldVehicleType.vehicle_image.replace('/assets/', 'assets/'),
      });
    }

    return {
      message: SuccessMsg.VEHICLETYPES.update,
      vehicletype: updatedUser,
    };
  }

  async deleteVehicleTypes(args: Record<string, unknown>) {
    const vehicleTypeDetails: IVehicleTypes = await VehicleTypes.findOne({
      where: { id: args.typeId },
    });
    if (!vehicleTypeDetails) {
      Utils.throwError(ErrorMsg.VEHICLETYPES.notFound);
    }
    const PriceDependencyCount = await PriceManagement.count({
      where: { vehicleType: args.typeId },
    });
    if (PriceDependencyCount > 0) {
      Utils.throwError(ErrorMsg.CATEGORY.priceDependency);
    }
    const CategoryDependencyCount = await Category.count({
      where: { vehicleType: args.typeId },
    });

    if (CategoryDependencyCount > 0) {
      Utils.throwError(ErrorMsg.CATEGORY.categoryDependency);
    }

    await VehicleTypes.destroy({
      where: { id: args.typeId },
    });
    return {
      message: SuccessMsg.VEHICLETYPES.delete,
    };
  }
})();
