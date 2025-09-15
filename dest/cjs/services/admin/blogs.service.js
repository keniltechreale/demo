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
const blogs_model_1 = __importDefault(require("../../models/blogs.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const aws_config_1 = __importDefault(require("../../config/aws.config"));
const aws_utils_1 = require("../../lib/aws.utils");
const sequelize_1 = require("sequelize");
exports.default = new (class BlogService {
    addBlogs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = yield blogs_model_1.default.create(args);
            return {
                message: constants_1.SuccessMsg.BLOGS.add,
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
                    [sequelize_1.Op.or]: [
                        { title: { [sequelize_1.Op.like]: `%${search}%` } },
                        { subtitle: { [sequelize_1.Op.like]: `%${search}%` } },
                        { author: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield blogs_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const blogDetails = yield blogs_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.BLOGS.get,
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
            const oldBlog = yield blogs_model_1.default.findOne({
                where: { id: blogId },
            });
            if (!oldBlog) {
                Utils.throwError(constants_1.ErrorMsg.BLOGS.notFound);
            }
            yield blogs_model_1.default.update(args, { where: { id: blogId } });
            const updatedBlog = yield blogs_model_1.default.findOne({
                where: { id: blogId },
            });
            if (oldBlog.image && oldBlog.image !== updatedBlog.image) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: oldBlog.image.replace('/assets/', 'assets/'),
                });
            }
            if (oldBlog.author_image && oldBlog.author_image !== updatedBlog.author_image) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: oldBlog.author_image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: constants_1.SuccessMsg.BLOGS.update,
                blog: updatedBlog,
            };
        });
    }
    deleteBlogs(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldBlog = yield blogs_model_1.default.findOne({
                where: { id: args.blogId },
            });
            if (!oldBlog) {
                Utils.throwError(constants_1.ErrorMsg.BLOGS.notFound);
            }
            yield blogs_model_1.default.destroy({
                where: { id: args.blogId },
            });
            if (oldBlog.image) {
                yield (0, aws_utils_1.removeFilefromS3)({
                    Bucket: aws_config_1.default.s3BucketName,
                    Key: oldBlog.image.replace('/assets/', 'assets/'),
                });
            }
            return {
                message: constants_1.SuccessMsg.BLOGS.delete,
            };
        });
    }
})();
//# sourceMappingURL=blogs.service.js.map