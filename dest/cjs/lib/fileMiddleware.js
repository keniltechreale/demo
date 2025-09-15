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
exports.uploadFunction = exports.uploadMultipleDoc = void 0;
const multer_1 = __importDefault(require("multer"));
const Utils = __importStar(require("./utils"));
const constants_1 = require("./constants");
const documents_model_1 = __importDefault(require("../models/documents.model"));
// import { Op, literal } from 'sequelize';
// import CityManagement, { ICityManagement } from '../models/citymanagement.model';
// import { DocumentsData } from '../middleware/validation.middleware';
const storage = multer_1.default.memoryStorage(); // Use memory storage for simplicity; adjust as needed
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});
function uploadMultipleDoc(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // let existCity: ICityManagement;
            // let allDocuments = [];
            // const city = req.user.city;
            // const vehicleType = req.body.type;
            const documents = yield documents_model_1.default.findAll({
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
                    if (err instanceof multer_1.default.MulterError) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res
                                .status(Utils.statusCode.BAD_REQUEST)
                                .send(Utils.sendErrorResponse(Utils.getErrorMsg(constants_1.ErrorMsg.EXCEPTIONS.FileSizelimit)));
                        }
                        else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                            return res
                                .status(Utils.statusCode.BAD_REQUEST)
                                .send(Utils.getErrorMsg(constants_1.ErrorMsg.EXCEPTIONS.unexpectedFile));
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
exports.uploadMultipleDoc = uploadMultipleDoc;
const uploadFunction = (req, res, next) => {
    void uploadMultipleDoc(req, res, next);
};
exports.uploadFunction = uploadFunction;
//# sourceMappingURL=fileMiddleware.js.map