var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import FAQs from '../../models/faqs.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
export default new (class FAQsService {
    addFAQs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const existFAQs = yield FAQs.findOne({
                where: { question: args.question },
            });
            if (existFAQs) {
                Utils.throwError(ErrorMsg.FAQs.alreadyExist);
            }
            const newFAQs = yield FAQs.create(args);
            return {
                message: SuccessMsg.FAQs.add,
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
                    [Op.or]: [
                        { question: { [Op.like]: `%${search}%` } },
                        { answer: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            if (arg.status) {
                filterObject.status = arg.status;
            }
            const totalCount = yield FAQs.count(filterObject);
            const totalPage = Math.ceil(totalCount / limit);
            const FAQsDetails = yield FAQs.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: SuccessMsg.FAQs.get,
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
            let faqsDetails = yield FAQs.findOne({
                where: { id: faqsId },
            });
            if (!faqsDetails) {
                Utils.throwError(ErrorMsg.FAQs.notFound);
            }
            yield FAQs.update(args, {
                where: { id: faqsId },
            });
            faqsDetails = yield FAQs.findOne({
                where: { id: faqsId },
            });
            return {
                message: SuccessMsg.FAQs.update,
                faqs: faqsDetails,
            };
        });
    }
    deleteFAQs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const faqsDetails = yield FAQs.findOne({
                where: { id: args.faqsId },
            });
            if (!faqsDetails) {
                Utils.throwError(ErrorMsg.FAQs.notFound);
            }
            yield FAQs.destroy({
                where: { id: args.faqsId },
            });
            return {
                message: SuccessMsg.FAQs.delete,
            };
        });
    }
})();
//# sourceMappingURL=faqs.service.js.map