var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Feedbacks from '../../models/feedback.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Category from '../../models/category.model';
import { Op } from 'sequelize';
export default new (class FeedbacksService {
    addFeedbacks(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existFeedbacks = yield Feedbacks.findOne({
                where: { question: args.question },
            });
            if (existFeedbacks) {
                Utils.throwError(ErrorMsg.FEEDBACKS.alreadyExist);
            }
            const newFeedbacks = yield Feedbacks.create(args);
            return {
                message: SuccessMsg.FEEDBACKS.add,
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
                    [Op.or]: [{ question: { [Op.like]: `%${search}%` } }],
                };
            }
            const totalCount = yield Feedbacks.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const feedbacksDetails = yield Feedbacks.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            const keywordsIds = feedbacksDetails.flatMap((feedback) => feedback.keywords);
            const keywords = yield Category.findAll({
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
                message: SuccessMsg.FEEDBACKS.get,
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
            let faqsDetails = yield Feedbacks.findOne({
                where: { id: feedbackId },
            });
            if (!faqsDetails) {
                Utils.throwError(ErrorMsg.FAQs.notFound);
            }
            yield Feedbacks.update(args, {
                where: { id: feedbackId },
            });
            faqsDetails = yield Feedbacks.findOne({
                where: { id: feedbackId },
            });
            return {
                message: SuccessMsg.FEEDBACKS.update,
                feedbacks: faqsDetails,
            };
        });
    }
    deleteFeedbacks(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const feedbacks = yield Feedbacks.findOne({
                where: { id: args.feedbackId },
            });
            if (!feedbacks) {
                Utils.throwError(ErrorMsg.FEEDBACKS.notFound);
            }
            yield Feedbacks.destroy({
                where: { id: args.feedbackId },
            });
            return {
                message: SuccessMsg.FEEDBACKS.delete,
            };
        });
    }
})();
//# sourceMappingURL=feedback.service.js.map