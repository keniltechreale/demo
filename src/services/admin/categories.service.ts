import Category, { ICategory } from '../../models/category.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';

export default new (class CategoryService {
  async addCategory(args: Record<string, unknown>, type: string) {
    const existcategory: ICategory = await Category.findOne({
      where: { name: args.name, type: type },
    });
    if (existcategory) {
      Utils.throwError(ErrorMsg.CATEGORY.alreadyExist);
    }
    const typedArgs = args as Record<string, any>;

    if (typedArgs.keywords && typeof typedArgs.keywords === 'string') {
      typedArgs.keywords = typedArgs.keywords.split(',');
    }
    const newCategory: ICategory = await Category.create({ type: type, ...args });

    return {
      message: SuccessMsg.CATEGORY.add,
      category: newCategory,
    };
  }

  async getAllCategory(arg: ISearch, type: string) {
    const { page, limit, search, status, vehicleType } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = { type: type };
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      };
    }
    if (status) {
      filterObject.status = status;
    }
    if (vehicleType) {
      filterObject.vehicleType = vehicleType;
    }
    const totalCount = await Category.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const categoryDetails = await Category.findAll({
      where: filterObject,
      include: [
        {
          model: VehicleTypes,
        },
      ],
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
      nest: true,
    });

    return {
      message: SuccessMsg.CATEGORY.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      category: categoryDetails,
    };
  }

  async updateCategorys(args: Record<string, unknown>, categoryId: string) {
    const category: ICategory = await Category.findOne({ where: { id: categoryId } });
    if (!category) {
      Utils.throwError(ErrorMsg.CATEGORY.notFound);
    }
    const typedArgs = args as Record<string, any>;

    if (typedArgs.keywords && typeof typedArgs.keywords === 'string') {
      typedArgs.keywords = typedArgs.keywords.split(',');
    }
    await Category.update(args, { where: { id: categoryId } });
    const updatedCategory: ICategory = await Category.findOne({ where: { id: categoryId } });

    return {
      message: SuccessMsg.CATEGORY.update,
      category: updatedCategory,
    };
  }

  async deleteCategorys(args: Record<string, unknown>) {
    const CategoryDetails: ICategory = await Category.findOne({ where: { id: args.categoryId } });
    if (!CategoryDetails) {
      Utils.throwError(ErrorMsg.CATEGORY.notFound);
    }
    if (!CategoryDetails) {
      Utils.throwError(ErrorMsg.CATEGORY.notFound);
    }

    await Category.destroy({
      where: { id: args.categoryId },
    });
    return {
      message: SuccessMsg.CATEGORY.delete,
    };
  }
})();
