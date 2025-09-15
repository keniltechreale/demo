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
const documents_model_1 = __importDefault(require("../../models/documents.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const sequelize_1 = require("sequelize");
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
exports.default = new (class DocumentsService {
    addDocuments(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existDocuments = yield documents_model_1.default.findOne({
                where: {
                    key: args.key,
                },
            });
            if (existDocuments) {
                Utils.throwError(constants_1.ErrorMsg.DOCUMENTS.alreadyExist);
            }
            const newDocuments = yield documents_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.DOCUMENTS.add,
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
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${search}%` } },
                        { key: { [sequelize_1.Op.like]: `%${search}%` } },
                        { description: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield documents_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const documentsDetails = yield documents_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            // Fetch detailed information for vehicleTypes
            const vehicleIds = documentsDetails.flatMap((doc) => doc.vehicleTypes);
            const vehicles = yield vehicleTypes_model_1.default.findAll({
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
                message: constants_1.SuccessMsg.DOCUMENTS.get,
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
            let documents = yield documents_model_1.default.findOne({
                where: {
                    id: documentsId,
                },
            });
            if (!documents) {
                Utils.throwError(constants_1.ErrorMsg.DOCUMENTS.notFound);
            }
            yield documents_model_1.default.update(args, {
                where: {
                    id: documentsId,
                },
            });
            documents = yield documents_model_1.default.findOne({
                where: {
                    id: documentsId,
                },
            });
            return {
                message: constants_1.SuccessMsg.DOCUMENTS.update,
                documents: documents,
            };
        });
    }
    deleteDocuments(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const documentsDetails = yield documents_model_1.default.findOne({
                where: {
                    id: args.documentsId,
                },
            });
            if (!documentsDetails) {
                Utils.throwError(constants_1.ErrorMsg.DOCUMENTS.notFound);
            }
            yield documents_model_1.default.destroy({
                where: {
                    id: args.documentsId,
                },
            });
            return {
                message: constants_1.SuccessMsg.DOCUMENTS.delete,
            };
        });
    }
})();
//# sourceMappingURL=documents.service.js.map