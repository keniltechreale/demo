import AdditionalFee, { IAdditionalFee } from '../../models/AdditionalFees';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';

export default new (class AdditionalFeesService {
  async addAdditionalFee(args: Record<string, unknown>) {
    const existingFee = await AdditionalFee.findOne({
      where: { type: args.type },
    });
    if (existingFee) {
      Utils.throwError(ErrorMsg.ADDITIONAL_FEES?.alreadyExists);
    }
    const newFee: IAdditionalFee = await AdditionalFee.create(args);

    return {
      message: SuccessMsg.ADDITIONAL_FEES?.add,
      additionalFee: newFee,
    };
  }

  async getAllAdditionalFees(arg: ISearch) {
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
          { type: { [Op.like]: `%${search}%` } },
          { applyOn: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await AdditionalFee.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const additionalFees = await AdditionalFee.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    return {
      message: SuccessMsg.ADDITIONAL_FEES?.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      additionalFees: additionalFees,
    };
  }

  async updateAdditionalFee(args: Record<string, unknown>, id: string) {
    const oldFee: IAdditionalFee = (await AdditionalFee.findOne({
      where: { id },
    })) as IAdditionalFee;
    if (!oldFee) {
      Utils.throwError(ErrorMsg.ADDITIONAL_FEES?.notFound);
    }

    if (args.type) {
      const existingFee = await AdditionalFee.findOne({
        where: {
          type: args.type,
          id: { [Op.ne]: id },
        },
      });
      if (existingFee) {
        Utils.throwError(ErrorMsg.ADDITIONAL_FEES?.alreadyExists);
      }
    }

    await AdditionalFee.update(args, { where: { id } });
    const updatedFee: IAdditionalFee = (await AdditionalFee.findOne({
      where: { id },
    })) as IAdditionalFee;

    return {
      message: SuccessMsg.ADDITIONAL_FEES?.update,
      additionalFee: updatedFee,
    };
  }

  async deleteAdditionalFee(args: { id: string }) {
    const oldFee: IAdditionalFee = (await AdditionalFee.findOne({
      where: { id: args.id },
    })) as IAdditionalFee;
    if (!oldFee) {
      Utils.throwError(ErrorMsg.ADDITIONAL_FEES?.notFound);
    }
    await AdditionalFee.destroy({
      where: { id: args.id },
    });

    return {
      message: SuccessMsg.ADDITIONAL_FEES?.delete,
    };
  }
})();
