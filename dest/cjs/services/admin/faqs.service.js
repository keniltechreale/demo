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
const faqs_model_1 = __importDefault(require("../../models/faqs.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const sequelize_1 = require("sequelize");
exports.default = new (class FAQsService {
    addFAQs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existFAQs = yield faqs_model_1.default.findOne({
                where: { question: args.question },
            });
            if (existFAQs) {
                Utils.throwError(constants_1.ErrorMsg.FAQs.alreadyExist);
            }
            const newFAQs = yield faqs_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.FAQs.add,
                faqs: newFAQs,
            };
        });
    }
    getAllFAQs(arg) {
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
                        { question: { [sequelize_1.Op.like]: `%${search}%` } },
                        { answer: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            if (arg.status) {
                filterObject.status = arg.status;
            }
            const totalCount = yield faqs_model_1.default.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const FAQsDetails = yield faqs_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.FAQs.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                faqs: FAQsDetails,
            };
        });
    }
    updateFAQs(args, faqsId) {
        return __awaiter(this, void 0, void 0, function* () {
            let faqsDetails = yield faqs_model_1.default.findOne({
                where: { id: faqsId },
            });
            if (!faqsDetails) {
                Utils.throwError(constants_1.ErrorMsg.FAQs.notFound);
            }
            yield faqs_model_1.default.update(args, {
                where: { id: faqsId },
            });
            faqsDetails = yield faqs_model_1.default.findOne({
                where: { id: faqsId },
            });
            return {
                message: constants_1.SuccessMsg.FAQs.update,
                faqs: faqsDetails,
            };
        });
    }
    deleteFAQs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const faqsDetails = yield faqs_model_1.default.findOne({
                where: { id: args.faqsId },
            });
            if (!faqsDetails) {
                Utils.throwError(constants_1.ErrorMsg.FAQs.notFound);
            }
            yield faqs_model_1.default.destroy({
                where: { id: args.faqsId },
            });
            return {
                message: constants_1.SuccessMsg.FAQs.delete,
            };
        });
    }
})();
//# sourceMappingURL=faqs.service.js.map