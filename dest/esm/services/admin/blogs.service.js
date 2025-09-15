var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Blogs from '../../models/blogs.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import AWSUtils from '../../config/aws.config';
import { removeFilefromS3 } from '../../lib/aws.utils';
import { Op } from 'sequelize';
export default new (class BlogService {
    addBlogs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield Blogs.create(args);
            return {
                message: SuccessMsg.BLOGS.add,
                blog: newBlog,
            };
        });
    }
    getAllBlogs(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                // Escape special characters in search string
                filterObject = {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { subtitle: { [Op.like]: `%${search}%` } },
                        { author: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Blogs.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const blogDetails = yield Blogs.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: SuccessMsg.BLOGS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                blog: blogDetails,
            };
        });
    }
    updateBlogs(args, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBlog = yield Blogs.findOne({
                where: { id: blogId },
            });
            if (!oldBlog) {
                Utils.throwError(ErrorMsg.BLOGS.notFound);
            }
            yield Blogs.update(args, { where: { id: blogId } });
            const updatedBlog = yield Blogs.findOne({
                where: { id: blogId },
            });
            if (oldBlog.image && oldBlog.image !== updatedBlog.image) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldBlog.image.replace('/assets/', 'assets/'),
                });
            }
            if (oldBlog.author_image && oldBlog.author_image !== updatedBlog.author_image) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldBlog.author_image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: SuccessMsg.BLOGS.update,
                blog: updatedBlog,
            };
        });
    }
    deleteBlogs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBlog = yield Blogs.findOne({
                where: { id: args.blogId },
            });
            if (!oldBlog) {
                Utils.throwError(ErrorMsg.BLOGS.notFound);
            }
            yield Blogs.destroy({
                where: { id: args.blogId },
            });
            if (oldBlog.image) {
                yield removeFilefromS3({
                    Bucket: AWSUtils.s3BucketName,
                    Key: oldBlog.image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: SuccessMsg.BLOGS.delete,
            };
        });
    }
})();
//# sourceMappingURL=blogs.service.js.map