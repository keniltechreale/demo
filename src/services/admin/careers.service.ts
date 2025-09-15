import Careers, { ICareer } from '../../models/careers.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import Category from '../../models/category.model';
import CareerApplications, { ICareerApplications } from '../../models/careerApplications.model';
import { Op } from 'sequelize';
export default new (class CareersService {
  async addCareers(args: Record<string, unknown>) {
    const newCareers: ICareer = await Careers.create(args);

    return {
      message: SuccessMsg.CAREERS.add,
      careers: newCareers,
    };
  }

  async getAllCareers(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { salaryRange: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await Careers.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const careersDetails = await Careers.findAll({
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
  }

  async updateCareers(args: Record<string, unknown>, careersId: string) {
    let updatedCareers: ICareer = await Careers.findOne({ where: { id: careersId } });
    if (!updatedCareers) {
      Utils.throwError(ErrorMsg.CAREERS.notFound);
    }
    await Careers.update(args, { where: { id: careersId } });
    updatedCareers = await Careers.findOne({ where: { id: careersId } });
    return {
      message: SuccessMsg.CAREERS.update,
      careers: updatedCareers,
    };
  }

  async deleteCareers(args: Record<string, unknown>) {
    const careersDetails: ICareer = await Careers.findOne({ where: { id: args.careersId } });
    if (!careersDetails) {
      Utils.throwError(ErrorMsg.CAREERS.notFound);
    }
    await Careers.destroy({
      where: { id: args.careersId },
    });

    return {
      message: SuccessMsg.CAREERS.delete,
    };
  }

  async getCareerApplicationsByCareerId(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        ...filterObject,
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { message: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await CareerApplications.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const applicationsDetails = await CareerApplications.findAll({
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
  }
})();
