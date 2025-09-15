import Blogs, { IBlogs } from '../../models/blogs.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import AWSUtils from '../../config/aws.config';
import { removeFilefromS3 } from '../../lib/aws.utils';
import { Op } from 'sequelize';

export default new (class BlogService {
  async addBlogs(args: Record<string, unknown>) {
    const newBlog: IBlogs = await Blogs.create(args);

    return {
      message: SuccessMsg.BLOGS.add,
      blog: newBlog,
    };
  }

  async getAllBlogs(arg: ISearch) {
    const { page, limit, search, status } = arg;
    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};

    if (status) {
      filterObject.status = status;
    }

    if (search?.length > 0) {
      // Escape special characters in search string

      filterObject = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { subtitle: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    const totalCount = await Blogs.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const blogDetails = await Blogs.findAll({
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
  }

  async updateBlogs(args: Record<string, unknown>, blogId: string) {
    const oldBlog: IBlogs = await Blogs.findOne({
      where: { id: blogId },
    });
    if (!oldBlog) {
      Utils.throwError(ErrorMsg.BLOGS.notFound);
    }

    await Blogs.update(args, { where: { id: blogId } });
    const updatedBlog: IBlogs = await Blogs.findOne({
      where: { id: blogId },
    });
    if (oldBlog.image && oldBlog.image !== updatedBlog.image) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldBlog.image.replace('/assets/', 'assets/'),
      });
    }
    if (oldBlog.author_image && oldBlog.author_image !== updatedBlog.author_image) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldBlog.author_image.replace('/assets/', 'assets/'),
      });
    }
    return {
      message: SuccessMsg.BLOGS.update,
      blog: updatedBlog,
    };
  }

  async deleteBlogs(args: Record<string, unknown>) {
    const oldBlog: IBlogs = await Blogs.findOne({
      where: { id: args.blogId },
    });
    if (!oldBlog) {
      Utils.throwError(ErrorMsg.BLOGS.notFound);
    }
    await Blogs.destroy({
      where: { id: args.blogId },
    });

    if (oldBlog.image) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldBlog.image.replace('/assets/', 'assets/'),
      });
    }
    return {
      message: SuccessMsg.BLOGS.delete,
    };
  }
})();
