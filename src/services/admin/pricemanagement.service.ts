import PriceManagement, { IPriceManagement } from '../../models/pricemanagement.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import CityManagement from '../../models/citymanagement.model';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';
import Category from '../../models/category.model';

export default new (class PriceManagementService {
  async addPriceManagement(args: Record<string, unknown>) {
    const existPrice: IPriceManagement = await PriceManagement.findOne({
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

    const newPrice: IPriceManagement = await PriceManagement.create(args);

    return {
      message: SuccessMsg.PRICES.add,
      prices: newPrice,
    };
  }

  async getPriceManagementById(args: Record<string, unknown>) {
    const priceDetails: IPriceManagement | null = await PriceManagement.findOne({
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
  }

  async getAllPriceManagement(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const offset = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
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

    const totalCount = await PriceManagement.count(filterObject);
    const totalPage = Math.ceil(totalCount / limit);
    const pricesDetails = await PriceManagement.findAll({
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
  }

  async updatePriceManagement(args: Record<string, unknown>, priceId: string) {
    const priceDetails: IPriceManagement = await PriceManagement.findOne({
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
    await PriceManagement.update(args, {
      where: { id: priceId },
    });
    const updatedPrice: IPriceManagement = await PriceManagement.findOne({
      where: { id: priceId },
    });
    return {
      message: SuccessMsg.PRICES.update,
      prices: updatedPrice,
    };
  }

  async deletePriceManagement(args: Record<string, unknown>) {
    const priceDetails: IPriceManagement = await PriceManagement.findOne({
      where: { id: args.priceId },
    });
    await PriceManagement.destroy({
      where: { id: args.priceId },
    });
    if (!priceDetails) {
      Utils.throwError(ErrorMsg.PRICES.notFound);
    }
    return {
      message: SuccessMsg.PRICES.delete,
    };
  }
})();
