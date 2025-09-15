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
const careers_model_1 = __importDefault(require("../../models/careers.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const category_model_1 = __importDefault(require("../../models/category.model"));
const careerApplications_model_1 = __importDefault(require("../../models/careerApplications.model"));
const sequelize_1 = require("sequelize");
exports.default = new (class CareersService {
    addCareers(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCareers = yield careers_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.CAREERS.add,
                careers: newCareers,
            };
        });
    }
    getAllCareers(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${search}%` } },
                        { salaryRange: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield careers_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const careersDetails = yield careers_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: category_model_1.default,
                    },
                ],
                offset: skip,
                limit: limit,
                nest: true,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.CAREERS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                careers: careersDetails,
            };
        });
    }
    updateCareers(args, careersId) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedCareers = yield careers_model_1.default.findOne({ where: { id: careersId } });
            if (!updatedCareers) {
                Utils.throwError(constants_1.ErrorMsg.CAREERS.notFound);
            }
            yield careers_model_1.default.update(args, { where: { id: careersId } });
            updatedCareers = yield careers_model_1.default.findOne({ where: { id: careersId } });
            return {
                message: constants_1.SuccessMsg.CAREERS.update,
                careers: updatedCareers,
            };
        });
    }
    deleteCareers(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const careersDetails = yield careers_model_1.default.findOne({ where: { id: args.careersId } });
            if (!careersDetails) {
                Utils.throwError(constants_1.ErrorMsg.CAREERS.notFound);
            }
            yield careers_model_1.default.destroy({
                where: { id: args.careersId },
            });
            return {
                message: constants_1.SuccessMsg.CAREERS.delete,
            };
        });
    }
    getCareerApplicationsByCareerId(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = Object.assign(Object.assign({}, filterObject), { [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { email: { [sequelize_1.Op.like]: `%${search}%` } },
                        { message: { [sequelize_1.Op.like]: `%${search}%` } },
                    ] });
            }
            const totalCount = yield careerApplications_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const applicationsDetails = yield careerApplications_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.CAREERAPPLICATIONS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                applications: applicationsDetails,
            };
        });
    }
})();
//# sourceMappingURL=careers.service.js.map