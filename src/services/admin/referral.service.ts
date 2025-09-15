import Referrals, { IReferrals } from '../../models/refferal.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';

export default new (class ReferralService {
  async getAllReferrals(arg: ISearch) {
    const { page, limit, search, status } = arg;
    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (status) filterObject.status = status;
    if (search?.length > 0) {
      filterObject = {
        ...filterObject,
        [Op.or]: [{ referral_code: { [Op.like]: `%${search}%` } }],
      };
    }

    const totalCount = await Referrals.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const referralDetails = await Referrals.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    return {
      message: SuccessMsg.REFERRAL.get,
      page,
      perPage: limit,
      totalCount,
      totalPage,
      referrals: referralDetails,
    };
  }

  async updateReferral(args: Record<string, unknown>, referralId: string) {
    const oldReferral: IReferrals | null = await Referrals.findOne({ where: { id: referralId } });
    if (!oldReferral) {
      Utils.throwError(ErrorMsg.REFERRAL.notFound);
    }
    await Referrals.update(args, { where: { id: referralId } });
    const updatedReferral: IReferrals | null = await Referrals.findOne({
      where: { id: referralId },
    });
    return {
      message: SuccessMsg.REFERRAL.update,
      referral: updatedReferral,
    };
  }

  async deleteReferral(args: { referralId: string }) {
    const oldReferral: IReferrals | null = await Referrals.findOne({
      where: { id: args.referralId },
    });
    if (!oldReferral) {
      Utils.throwError(ErrorMsg.REFERRAL.notFound);
    }
    await Referrals.destroy({ where: { id: args.referralId } });
    return {
      message: SuccessMsg.REFERRAL.delete,
    };
  }
})();
