var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Careers from '../../models/careers.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import Category from '../../models/category.model';
import CareerApplications from '../../models/careerApplications.model';
import { Op } from 'sequelize';
export default new (class CareersService {
    addCareers(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCareers = yield Careers.create(args);
            return {
                message: SuccessMsg.CAREERS.add,
                careers: newCareers,
            };
        });
    }
    getAllCareers(arg) {
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
                        { title: { [Op.like]: `%${search}%` } },
                        { salaryRange: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Careers.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const careersDetails = yield Careers.findAll({
                where: filterObject,
                include: [
                    {
                        model: Category,
                    },
                ],
                offset: skip,
                limit: limit,
                nest: true,
                raw: true,
            });
            return {
                message: SuccessMsg.CAREERS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                careers: careersDetails,
            };
        });
    }
    updateCareers(args, careersId) {
        return __awaiter(this, void 0, void 0, function* () {
            let updatedCareers = yield Careers.findOne({ where: { id: careersId } });
            if (!updatedCareers) {
                Utils.throwError(ErrorMsg.CAREERS.notFound);
            }
            yield Careers.update(args, { where: { id: careersId } });
            updatedCareers = yield Careers.findOne({ where: { id: careersId } });
            return {
                message: SuccessMsg.CAREERS.update,
                careers: updatedCareers,
            };
        });
    }
    deleteCareers(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const careersDetails = yield Careers.findOne({ where: { id: args.careersId } });
            if (!careersDetails) {
                Utils.throwError(ErrorMsg.CAREERS.notFound);
            }
            yield Careers.destroy({
                where: { id: args.careersId },
            });
            return {
                message: SuccessMsg.CAREERS.delete,
            };
        });
    }
    getCareerApplicationsByCareerId(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = Object.assign(Object.assign({}, filterObject), { [Op.or]: [
                        { name: { [Op.like]: `%${search}%` } },
                        { email: { [Op.like]: `%${search}%` } },
                        { message: { [Op.like]: `%${search}%` } },
                    ] });
            }
            const totalCount = yield CareerApplications.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const applicationsDetails = yield CareerApplications.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: SuccessMsg.CAREERAPPLICATIONS.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                applications: applicationsDetails,
            };
        });
    }
})();
//# sourceMappingURL=careers.service.js.map