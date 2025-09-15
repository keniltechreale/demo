var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import multer from 'multer';
import * as Utils from './utils';
import { ErrorMsg } from './constants';
import Documents from '../models/documents.model';
// import { Op, literal } from 'sequelize';
// import CityManagement, { ICityManagement } from '../models/citymanagement.model';
// import { DocumentsData } from '../middleware/validation.middleware';
const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
export function uploadMultipleDoc(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // let existCity: ICityManagement;
            // let allDocuments = [];
            // const city = req.user.city;
            // const vehicleType = req.body.type;
            const documents = yield Documents.findAll({
                where: { isRequired: true, status: true },
            });
            // if (city) {
            //   existCity = await CityManagement.findOne({
            //     where: {
            //       city: city,
            //       status: 'active',
            //       [Op.and]: [literal(`JSON_CONTAINS(vehicleTypes, '[${vehicleType}]')`)],
            //     },
            //   });
            // }
            // allDocuments = documents.filter((doc) => {
            //   const includesVehicleType = doc.vehicleTypes.includes(vehicleType);
            //   return includesVehicleType;
            // });
            // if (existCity) {
            //   const documentIds = existCity.documents;
            //   const filteredCityDocuments = await Documents.findAll({
            //     where: {
            //       id: documentIds,
            //     },
            //   });
            //   allDocuments.push(...filteredCityDocuments);
            // }
            req.documentsDetails = documents;
            const fields = documents.map((document) => {
                if (typeof document === 'string') {
                    return {
                        name: document,
                        maxCount: 4,
                    };
                }
                else if (typeof document === 'object' && document !== null) {
                    const { key } = document;
                    return {
                        name: key,
                        maxCount: 4,
                    };
                }
                else {
                    throw new Error('Document is not in the expected format');
                }
            });
            console.log('fields ---> ', fields);
            upload.fields(fields)(req, res, (err) => {
                if (err) {
                    if (err instanceof multer.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res
                                .status(Utils.statusCode.BAD_REQUEST)
                                .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.FileSizelimit)));
                        }
                        else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                            return res
                                .status(Utils.statusCode.BAD_REQUEST)
                                .send(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.unexpectedFile));
                        }
                    }
                    else {
                        return res
                            .status(Utils.getErrorStatusCode(err))
                            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                    }
                }
                next();
            });
        }
        catch (err) {
            res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    });
}
export const uploadFunction = (req, res, next) => {
    void uploadMultipleDoc(req, res, next);
};
//# sourceMappingURL=fileMiddleware.js.map