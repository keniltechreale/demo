import { NextFunction, Response } from 'express';
import multer from 'multer';
import { IRequest } from '../lib/common.interface';
import * as Utils from './utils';
import { ErrorMsg } from './constants';
import Documents, { IDocument } from '../models/documents.model';
// import { Op, literal } from 'sequelize';
// import CityManagement, { ICityManagement } from '../models/citymanagement.model';

// import { DocumentsData } from '../middleware/validation.middleware';

const storage = multer.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export async function uploadMultipleDoc(
  req: IRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // let existCity: ICityManagement;
    // let allDocuments = [];
    // const city = req.user.city;
    // const vehicleType = req.body.type;

    const documents: IDocument[] = await Documents.findAll({
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

    const fields = documents.map((document: any) => {
      if (typeof document === 'string') {
        return {
          name: document,
          maxCount: 4,
        };
      } else if (typeof document === 'object' && document !== null) {
        const { key } = document as { key: string };
        return {
          name: key,
          maxCount: 4,
        };
      } else {
        throw new Error('Document is not in the expected format');
      }
    });
    console.log('fields ---> ', fields);

    (upload.fields as (fields: multer.Field[]) => (req: any, res: any, cb: any) => any)(fields)(
      req,
      res,
      (err: any) => {
        if (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
              return res
                .status(Utils.statusCode.BAD_REQUEST)
                .send(
                  Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.FileSizelimit)),
                );
            } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
              return res
                .status(Utils.statusCode.BAD_REQUEST)
                .send(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.unexpectedFile));
            }
          } else {
            return res
              .status(Utils.getErrorStatusCode(err))
              .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
          }
        }
        next();
      },
    );
  } catch (err) {
    res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
  }
}

export const uploadFunction = (req: IRequest, res: Response, next: NextFunction) => {
  void uploadMultipleDoc(req, res, next);
};
