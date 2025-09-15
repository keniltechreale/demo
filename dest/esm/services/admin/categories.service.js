var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Category from '../../models/category.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import VehicleTypes from '../../models/vehicleTypes.model';
import { Op } from 'sequelize';
export default new (class CategoryService {
    addCategory(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const existcategory = yield Category.findOne({
                where: { name: args.name, type: type },
            });
            if (existcategory) {
                Utils.throwError(ErrorMsg.CATEGORY.alreadyExist);
            }
            const typedArgs = args;
            if (typedArgs.keywords && typeof typedArgs.keywords === 'string') {
                typedArgs.keywords = typedArgs.keywords.split(',');
            }
            const newCategory = yield Category.create(Object.assign({ type: type }, args));
            return {
                message: SuccessMsg.CATEGORY.add,
                category: newCategory,
            };
        });
    }
    getAllCategory(arg, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status, vehicleType } = arg;
            const skip = (page - 1) * limit;
            let filterObject = { type: type };
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
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
            const totalCount = yield Category.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const categoryDetails = yield Category.findAll({
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
        });
    }
    updateCategorys(args, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category.findOne({ where: { id: categoryId } });
            if (!category) {
                Utils.throwError(ErrorMsg.CATEGORY.notFound);
            }
            const typedArgs = args;
            if (typedArgs.keywords && typeof typedArgs.keywords === 'string') {
                typedArgs.keywords = typedArgs.keywords.split(',');
            }
            yield Category.update(args, { where: { id: categoryId } });
            const updatedCategory = yield Category.findOne({ where: { id: categoryId } });
            return {
                message: SuccessMsg.CATEGORY.update,
                category: updatedCategory,
            };
        });
    }
    deleteCategorys(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const CategoryDetails = yield Category.findOne({ where: { id: args.categoryId } });
            if (!CategoryDetails) {
                Utils.throwError(ErrorMsg.CATEGORY.notFound);
            }
            if (!CategoryDetails) {
                Utils.throwError(ErrorMsg.CATEGORY.notFound);
            }
            yield Category.destroy({
                where: { id: args.categoryId },
            });
            return {
                message: SuccessMsg.CATEGORY.delete,
            };
        });
    }
})();
//# sourceMappingURL=categories.service.js.map