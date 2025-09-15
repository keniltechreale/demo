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
const feedback_model_1 = __importDefault(require("../../models/feedback.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const category_model_1 = __importDefault(require("../../models/category.model"));
const sequelize_1 = require("sequelize");
exports.default = new (class FeedbacksService {
    addFeedbacks(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existFeedbacks = yield feedback_model_1.default.findOne({
                where: { question: args.question },
            });
            if (existFeedbacks) {
                Utils.throwError(constants_1.ErrorMsg.FEEDBACKS.alreadyExist);
            }
            const newFeedbacks = yield feedback_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.FEEDBACKS.add,
                feedback: newFeedbacks,
            };
        });
    }
    getAllFeedbacks(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [sequelize_1.Op.or]: [{ question: { [sequelize_1.Op.like]: `%${search}%` } }],
                };
            }
            const totalCount = yield feedback_model_1.default.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const feedbacksDetails = yield feedback_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            const keywordsIds = feedbacksDetails.flatMap((feedback) => feedback.keywords);
            const keywords = yield category_model_1.default.findAll({
                where: { id: keywordsIds },
                attributes: ['id', 'name', 'description'],
                raw: true,
            });
            const keywordsMap = keywords.reduce((acc, keyword) => {
                acc[keyword.id] = keyword;
                return acc;
            }, {});
            const detailedfeedbacksDetails = feedbacksDetails.map((feedback) => {
                return Object.assign(Object.assign({}, feedback), { keywords: feedback.keywords.map((id) => keywordsMap[id]) });
            });
            return {
                message: constants_1.SuccessMsg.FEEDBACKS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                feedback: detailedfeedbacksDetails,
            };
        });
    }
    updateFeedbacks(args, feedbackId) {
        return __awaiter(this, void 0, void 0, function* () {
            let faqsDetails = yield feedback_model_1.default.findOne({
                where: { id: feedbackId },
            });
            if (!faqsDetails) {
                Utils.throwError(constants_1.ErrorMsg.FAQs.notFound);
            }
            yield feedback_model_1.default.update(args, {
                where: { id: feedbackId },
            });
            faqsDetails = yield feedback_model_1.default.findOne({
                where: { id: feedbackId },
            });
            return {
                message: constants_1.SuccessMsg.FEEDBACKS.update,
                feedbacks: faqsDetails,
            };
        });
    }
    deleteFeedbacks(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedbacks = yield feedback_model_1.default.findOne({
                where: { id: args.feedbackId },
            });
            if (!feedbacks) {
                Utils.throwError(constants_1.ErrorMsg.FEEDBACKS.notFound);
            }
            yield feedback_model_1.default.destroy({
                where: { id: args.feedbackId },
            });
            return {
                message: constants_1.SuccessMsg.FEEDBACKS.delete,
            };
        });
    }
})();
//# sourceMappingURL=feedback.service.js.map