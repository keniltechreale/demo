import CityManagement, { ICityManagement } from '../../models/citymanagement.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';
import Document, { IDocument } from '../../models/documents.model';
import VehicleCategory, { IVehicleTypes } from '../../models/vehicleTypes.model';
import PriceManagement from '../../models/pricemanagement.model';

export default new (class CityService {
  async addCity(args: Record<string, unknown>) {
    const existCity: ICityManagement = await CityManagement.findOne({
      where: { city: args.city },
    });
    if (existCity) {
      Utils.throwError(ErrorMsg.CITY.alreadyExist);
    }

    const newCity: ICityManagement = await CityManagement.create(args);

    return {
      message: SuccessMsg.CITY.add,
      city: newCity,
    };
  }

  async getAllCity(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
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

    const totalCount = await CityManagement.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const cityDetails = await CityManagement.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    const vehicleIds = cityDetails.flatMap((city) => city.vehicleTypes);
    const documentIds = cityDetails.flatMap((city) => city.documents);

    const vehicles: IVehicleTypes[] = await VehicleCategory.findAll({
      where: { id: vehicleIds },
      raw: true,
    });

    const documents: IDocument[] = await Document.findAll({
      where: { id: documentIds },
      raw: true,
    });
    let vehicleMap = vehicles.reduce(
      (acc, vehicle) => {
        acc[vehicle.id] = vehicle;
        return acc;
      },
      {} as Record<number, any>,
    );
    let documentMap = documents.reduce(
      (acc, document) => {
        acc[document.id] = document;
        return acc;
      },
      {} as Record<number, any>,
    );
    let filteredVehicleMap = Object.fromEntries(
      Object.entries(vehicleMap).filter(([key, value]) => value !== null),
    );

    let filteredDocumentMap = Object.fromEntries(
      Object.entries(documentMap).filter(([key, value]) => value !== null),
    );

    const detailedCityDetails = cityDetails.map((city) => {
      return {
        ...city,
        vehicleTypes: city.vehicleTypes.map((id: number) => filteredVehicleMap[id]),
        documents: city.documents.map((id: number) => filteredDocumentMap[id]),
      };
    });

    return {
      message: SuccessMsg.CITY.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      city: detailedCityDetails,
    };
  }

  async updateCity(args: Record<string, unknown>, cityId: string) {
    const id = parseInt(cityId);
    const cityDetails: ICityManagement = await CityManagement.findOne({
      where: { id: id },
    });
    if (!cityDetails) {
      Utils.throwError(ErrorMsg.CITY.notFound);
    }
    await CityManagement.update(args, {
      where: { id: id },
    });
    const updatedCity: ICityManagement = await CityManagement.findOne({
      where: { id: id },
    });
    return {
      message: SuccessMsg.CITY.update,
      city: updatedCity,
    };
  }

  async deleteCity(cityId: string) {
    const id = parseInt(cityId);
    const cityDetails: ICityManagement = await CityManagement.findOne({
      where: { id: id },
    });

    const PriceDependencyCount = await PriceManagement.count({
      where: { city: id },
    });
    if (PriceDependencyCount > 0) {
      Utils.throwError(ErrorMsg.CITY.priceDependency);
    }
    if (!cityDetails) {
      Utils.throwError(ErrorMsg.CITY.notFound);
    }
    await CityManagement.destroy({
      where: { id: id },
    });
    return {
      message: SuccessMsg.CITY.delete,
    };
  }
})();
