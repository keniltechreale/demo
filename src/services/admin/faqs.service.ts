import FAQs, { IFAQs } from '../../models/faqs.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';

export default new (class FAQsService {
  async addFAQs(args: Record<string, unknown>) {
    const existFAQs: IFAQs = await FAQs.findOne({
      where: { question: args.question },
    });
    if (existFAQs) {
      Utils.throwError(ErrorMsg.FAQs.alreadyExist);
    }
    const newFAQs: IFAQs = await FAQs.create(args);

    return {
      message: SuccessMsg.FAQs.add,
      faqs: newFAQs,
    };
  }

  async getAllFAQs(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
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
    const totalCount = await FAQs.count(filterObject);
    const totalPage = Math.ceil(totalCount / limit);
    const FAQsDetails = await FAQs.findAll({
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
  }

  async updateFAQs(args: Record<string, unknown>, faqsId: string) {
    let faqsDetails: IFAQs = await FAQs.findOne({
      where: { id: faqsId },
    });
    if (!faqsDetails) {
      Utils.throwError(ErrorMsg.FAQs.notFound);
    }
    await FAQs.update(args, {
      where: { id: faqsId },
    });
    faqsDetails = await FAQs.findOne({
      where: { id: faqsId },
    });
    return {
      message: SuccessMsg.FAQs.update,
      faqs: faqsDetails,
    };
  }

  async deleteFAQs(args: Record<string, unknown>) {
    const faqsDetails: IFAQs = await FAQs.findOne({
      where: { id: args.faqsId },
    });
    if (!faqsDetails) {
      Utils.throwError(ErrorMsg.FAQs.notFound);
    }
    await FAQs.destroy({
      where: { id: args.faqsId },
    });

    return {
      message: SuccessMsg.FAQs.delete,
    };
  }
})();
