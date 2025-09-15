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
const category_model_1 = __importDefault(require("../../models/category.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const vehicleTypes_model_1 = __importDefault(require("../../models/vehicleTypes.model"));
const sequelize_1 = require("sequelize");
exports.default = new (class CategoryService {
    addCategory(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const existcategory = yield category_model_1.default.findOne({
                where: { name: args.name, type: type },
            });
            if (existcategory) {
                Utils.throwError(constants_1.ErrorMsg.CATEGORY.alreadyExist);
            }
            const typedArgs = args;
            if (typedArgs.keywords && typeof typedArgs.keywords === 'string') {
                typedArgs.keywords = typedArgs.keywords.split(',');
            }
            const newCategory = yield category_model_1.default.create(Object.assign({ type: type }, args));
            return {
                message: constants_1.SuccessMsg.CATEGORY.add,
                category: newCategory,
            };
        });
    }
    getAllCategory(arg, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status, vehicleType } = arg;
            const skip = (page - 1) * limit;
            let filterObject = { type: type };
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { description: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            if (status) {
                filterObject.status = status;
            }
            if (vehicleType) {
                filterObject.vehicleType = vehicleType;
            }
            const totalCount = yield category_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const categoryDetails = yield category_model_1.default.findAll({
                where: filterObject,
                include: [
                    {
                        model: vehicleTypes_model_1.default,
                    },
                ],
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
                nest: true,
            });
            return {
                message: constants_1.SuccessMsg.CATEGORY.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                category: categoryDetails,
            };
        });
    }
    updateCategorys(args, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield category_model_1.default.findOne({ where: { id: categoryId } });
            if (!category) {
                Utils.throwError(constants_1.ErrorMsg.CATEGORY.notFound);
            }
            const typedArgs = args;
            if (typedArgs.keywords && typeof typedArgs.keywords === 'string') {
                typedArgs.keywords = typedArgs.keywords.split(',');
            }
            yield category_model_1.default.update(args, { where: { id: categoryId } });
            const updatedCategory = yield category_model_1.default.findOne({ where: { id: categoryId } });
            return {
                message: constants_1.SuccessMsg.CATEGORY.update,
                category: updatedCategory,
            };
        });
    }
    deleteCategorys(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const CategoryDetails = yield category_model_1.default.findOne({ where: { id: args.categoryId } });
            if (!CategoryDetails) {
                Utils.throwError(constants_1.ErrorMsg.CATEGORY.notFound);
            }
            if (!CategoryDetails) {
                Utils.throwError(constants_1.ErrorMsg.CATEGORY.notFound);
            }
            yield category_model_1.default.destroy({
                where: { id: args.categoryId },
            });
            return {
                message: constants_1.SuccessMsg.CATEGORY.delete,
            };
        });
    }
})();
//# sourceMappingURL=categories.service.js.map