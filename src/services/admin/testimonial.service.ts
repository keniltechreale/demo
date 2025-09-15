import Testimonials, { ITestimonials } from '../../models/testimonial.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import AWSUtils from '../../config/aws.config';
import { removeFilefromS3 } from '../../lib/aws.utils';
import { Op } from 'sequelize';
export default new (class TestimonialService {
  async addTestimonials(args: Record<string, unknown>) {
    const newTestimonial: ITestimonials = await Testimonials.create(args);

    return {
      message: SuccessMsg.TESTIMONIALS.add,
      testimonial: newTestimonial,
    };
  }

  async getAllTestimonials(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [
          { description: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await Testimonials.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const testimonialDetails = await Testimonials.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    return {
      message: SuccessMsg.TESTIMONIALS.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      testimonial: testimonialDetails,
    };
  }

  async updateTestimonials(args: Record<string, unknown>, testimonialId: string) {
    const oldTestimonial: ITestimonials = await Testimonials.findOne({
      where: { id: testimonialId },
    });
    if (!oldTestimonial) {
      Utils.throwError(ErrorMsg.TESTIMONIALS.notFound);
    }

    await Testimonials.update(args, { where: { id: testimonialId } });
    const updatedTestimonial: ITestimonials = await Testimonials.findOne({
      where: { id: testimonialId },
    });
    if (oldTestimonial.image && oldTestimonial.image !== updatedTestimonial.image) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldTestimonial.image.replace('/assets/', 'assets/'),
      });
    }
    return {
      message: SuccessMsg.TESTIMONIALS.update,
      testimonial: updatedTestimonial,
    };
  }

  async deleteTestimonials(args: Record<string, unknown>) {
    const oldTestimonial: ITestimonials = await Testimonials.findOne({
      where: { id: args.testimonialId },
    });
    if (!oldTestimonial) {
      Utils.throwError(ErrorMsg.TESTIMONIALS.notFound);
    }
    await Testimonials.destroy({
      where: { id: args.testimonialId },
    });

    if (oldTestimonial.image) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldTestimonial.image.replace('/assets/', 'assets/'),
      });
    }
    return {
      message: SuccessMsg.TESTIMONIALS.delete,
    };
  }
})();
