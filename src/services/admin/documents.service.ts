import Documents, { IDocument } from '../../models/documents.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';
import VehicleCategory, { IVehicleTypes } from '../../models/vehicleTypes.model';

export default new (class DocumentsService {
  async addDocuments(args: Record<string, unknown>) {
    const existDocuments: IDocument = await Documents.findOne({
      where: {
        key: args.key,
      },
    });
    if (existDocuments) {
      Utils.throwError(ErrorMsg.DOCUMENTS.alreadyExist);
    }
    const newDocuments: IDocument = await Documents.create(args);

    return {
      message: SuccessMsg.DOCUMENTS.add,
      documents: newDocuments,
    };
  }

  async getAllDocuments(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search && search.length > 0) {
      filterObject = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { key: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await Documents.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const documentsDetails = await Documents.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    // Fetch detailed information for vehicleTypes
    const vehicleIds = documentsDetails.flatMap((doc) => doc.vehicleTypes);
    const vehicles: IVehicleTypes[] = await VehicleCategory.findAll({
      where: { id: vehicleIds },
      raw: true,
    });

    // Map vehicles by their IDs for quick lookup
    const vehicleMap = vehicles.reduce(
      (acc, vehicle) => {
        acc[vehicle.id] = vehicle;
        return acc;
      },
      {} as Record<number, any>,
    );

    // Add vehicle details to the document details
    const detailedDocumentsDetails = documentsDetails.map((doc) => {
      return {
        ...doc,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        vehicleTypes: doc.vehicleTypes.map((id: number) => vehicleMap[id]),
      };
    });

    return {
      message: SuccessMsg.DOCUMENTS.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      documents: detailedDocumentsDetails,
    };
  }

  async updateDocuments(args: Record<string, unknown>, documentsId: string) {
    let documents: IDocument = await Documents.findOne({
      where: {
        id: documentsId,
      },
    });
    if (!documents) {
      Utils.throwError(ErrorMsg.DOCUMENTS.notFound);
    }

    await Documents.update(args, {
      where: {
        id: documentsId,
      },
    });

    documents = await Documents.findOne({
      where: {
        id: documentsId,
      },
    });
    return {
      message: SuccessMsg.DOCUMENTS.update,
      documents: documents,
    };
  }

  async deleteDocuments(args: Record<string, unknown>) {
    const documentsDetails: IDocument = await Documents.findOne({
      where: {
        id: args.documentsId,
      },
    });

    if (!documentsDetails) {
      Utils.throwError(ErrorMsg.DOCUMENTS.notFound);
    }

    await Documents.destroy({
      where: {
        id: args.documentsId,
      },
    });
    return {
      message: SuccessMsg.DOCUMENTS.delete,
    };
  }
})();
