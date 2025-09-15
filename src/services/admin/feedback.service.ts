import Feedbacks, { IFeedbacks } from '../../models/feedback.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import Category, { ICategory } from '../../models/category.model';
import { Op } from 'sequelize';
export default new (class FeedbacksService {
  async addFeedbacks(args: Record<string, unknown>) {
    const existFeedbacks: IFeedbacks = await Feedbacks.findOne({
      where: { question: args.question },
    });
    if (existFeedbacks) {
      Utils.throwError(ErrorMsg.FEEDBACKS.alreadyExist);
    }
    const newFeedbacks: IFeedbacks = await Feedbacks.create(args);
    return {
      message: SuccessMsg.FEEDBACKS.add,
      feedback: newFeedbacks,
    };
  }

  async getAllFeedbacks(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [{ question: { [Op.like]: `%${search}%` } }],
      };
    }

    const totalCount = await Feedbacks.count(filterObject);
    const totalPage = Math.ceil(totalCount / limit);
    const feedbacksDetails = await Feedbacks.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });
    const keywordsIds = feedbacksDetails.flatMap((feedback) => feedback.keywords);
    const keywords: ICategory[] = await Category.findAll({
      where: { id: keywordsIds },
      attributes: ['id', 'name', 'description'],
      raw: true,
    });
    const keywordsMap = keywords.reduce(
      (acc, keyword) => {
        acc[keyword.id] = keyword;
        return acc;
      },
      {} as Record<number, any>,
    );
    const detailedfeedbacksDetails = feedbacksDetails.map((feedback) => {
      return {
        ...feedback,
        keywords: feedback.keywords.map((id: number) => keywordsMap[id]),
      };
    });
    return {
      message: SuccessMsg.FEEDBACKS.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      feedback: detailedfeedbacksDetails,
    };
  }

  async updateFeedbacks(args: Record<string, unknown>, feedbackId: string) {
    let faqsDetails: IFeedbacks = await Feedbacks.findOne({
      where: { id: feedbackId },
    });
    if (!faqsDetails) {
      Utils.throwError(ErrorMsg.FAQs.notFound);
    }
    await Feedbacks.update(args, {
      where: { id: feedbackId },
    });
    faqsDetails = await Feedbacks.findOne({
      where: { id: feedbackId },
    });
    return {
      message: SuccessMsg.FEEDBACKS.update,
      feedbacks: faqsDetails,
    };
  }

  async deleteFeedbacks(args: Record<string, unknown>) {
    const feedbacks: IFeedbacks = await Feedbacks.findOne({
      where: { id: args.feedbackId },
    });
    if (!feedbacks) {
      Utils.throwError(ErrorMsg.FEEDBACKS.notFound);
    }
    await Feedbacks.destroy({
      where: { id: args.feedbackId },
    });

    return {
      message: SuccessMsg.FEEDBACKS.delete,
    };
  }
})();
