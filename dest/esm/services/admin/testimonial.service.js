var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Testimonials from '../../models/testimonial.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import AWSUtils from '../../config/aws.config';
import { removeFilefromS3 } from '../../lib/aws.utils';
import { Op } from 'sequelize';
export default new (class TestimonialService {
    addTestimonials(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTestimonial = yield Testimonials.create(args);
            return {
                message: SuccessMsg.TESTIMONIALS.add,
                testimonial: newTestimonial,
            };
        });
    }
    getAllTestimonials(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = {
                    [Op.or]: [
                        { description: { [Op.like]: `%${search}%` } },
                        { name: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Testimonials.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const testimonialDetails = yield Testimonials.findAll({
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
        });
    }
    updateTestimonials(args, testimonialId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldTestimonial = yield Testimonials.findOne({
                where: { id: testimonialId },
            });
            if (!oldTestimonial) {
                Utils.throwError(ErrorMsg.TESTIMONIALS.notFound);
            }
            yield Testimonials.update(args, { where: { id: testimonialId } });
            const updatedTestimonial = yield Testimonials.findOne({
                where: { id: testimonialId },
            });
            if (oldTestimonial.image && oldTestimonial.image !== updatedTestimonial.image) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldTestimonial.image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: SuccessMsg.TESTIMONIALS.update,
                testimonial: updatedTestimonial,
            };
        });
    }
    deleteTestimonials(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldTestimonial = yield Testimonials.findOne({
                where: { id: args.testimonialId },
            });
            if (!oldTestimonial) {
                Utils.throwError(ErrorMsg.TESTIMONIALS.notFound);
            }
            yield Testimonials.destroy({
                where: { id: args.testimonialId },
            });
            if (oldTestimonial.image) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldTestimonial.image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: SuccessMsg.TESTIMONIALS.delete,
            };
        });
    }
})();
//# sourceMappingURL=testimonial.service.js.map