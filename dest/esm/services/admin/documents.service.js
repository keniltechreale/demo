var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Documents from '../../models/documents.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
import VehicleCategory from '../../models/vehicleTypes.model';
export default new (class DocumentsService {
    addDocuments(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existDocuments = yield Documents.findOne({
                where: {
                    key: args.key,
                },
            });
            if (existDocuments) {
                Utils.throwError(ErrorMsg.DOCUMENTS.alreadyExist);
            }
            const newDocuments = yield Documents.create(args);
            return {
                message: SuccessMsg.DOCUMENTS.add,
                documents: newDocuments,
            };
        });
    }
    getAllDocuments(arg) {
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
                        { title: { [Op.like]: `%${search}%` } },
                        { key: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Documents.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const documentsDetails = yield Documents.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            // Fetch detailed information for vehicleTypes
            const vehicleIds = documentsDetails.flatMap((doc) => doc.vehicleTypes);
            const vehicles = yield VehicleCategory.findAll({
                where: { id: vehicleIds },
                raw: true,
            });
            // Map vehicles by their IDs for quick lookup
            const vehicleMap = vehicles.reduce((acc, vehicle) => {
                acc[vehicle.id] = vehicle;
                return acc;
            }, {});
            // Add vehicle details to the document details
            const detailedDocumentsDetails = documentsDetails.map((doc) => {
                return Object.assign(Object.assign({}, doc), { 
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    vehicleTypes: doc.vehicleTypes.map((id) => vehicleMap[id]) });
            });
            return {
                message: SuccessMsg.DOCUMENTS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                documents: detailedDocumentsDetails,
            };
        });
    }
    updateDocuments(args, documentsId) {
        return __awaiter(this, void 0, void 0, function* () {
            let documents = yield Documents.findOne({
                where: {
                    id: documentsId,
                },
            });
            if (!documents) {
                Utils.throwError(ErrorMsg.DOCUMENTS.notFound);
            }
            yield Documents.update(args, {
                where: {
                    id: documentsId,
                },
            });
            documents = yield Documents.findOne({
                where: {
                    id: documentsId,
                },
            });
            return {
                message: SuccessMsg.DOCUMENTS.update,
                documents: documents,
            };
        });
    }
    deleteDocuments(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentsDetails = yield Documents.findOne({
                where: {
                    id: args.documentsId,
                },
            });
            if (!documentsDetails) {
                Utils.throwError(ErrorMsg.DOCUMENTS.notFound);
            }
            yield Documents.destroy({
                where: {
                    id: args.documentsId,
                },
            });
            return {
                message: SuccessMsg.DOCUMENTS.delete,
            };
        });
    }
})();
//# sourceMappingURL=documents.service.js.map