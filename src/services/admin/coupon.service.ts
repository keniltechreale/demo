import Coupons, { ICoupons } from '../../models/coupon.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { ISearch } from '../../lib/common.interface';
import { generateUniqueCouponCode } from '../../lib/helpFunctions';
import { Op } from 'sequelize';

export default new (class CouponService {
  async addCoupons(args: Record<string, unknown>) {
    const code = generateUniqueCouponCode();
    console.log(code, args);
    if (args.start_date) {
      const startDate = new Date(args.start_date as string);
      const today = new Date();

      if (startDate > today) {
        args.status = 'inactive';
      }
    }

    const newCoupon: ICoupons = await Coupons.create({ code, ...args });

    return {
      message: SuccessMsg.COUPONS.add,
      coupon: newCoupon,
    };
  }

  async getAllCoupons(arg: ISearch) {
    const { page, limit, search, status } = arg;

    const skip = (page - 1) * limit;
    let filterObject: Record<string, unknown> = {};
    if (status) {
      filterObject.status = status;
    }
    if (search?.length > 0) {
      filterObject = {
        [Op.or]: [
          { code: { [Op.like]: `%${search}%` } },
          { title: { [Op.like]: `%${search}%` } },
          { subTitle: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await Coupons.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const couponDetails = await Coupons.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    return {
      message: SuccessMsg.COUPONS.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      coupon: couponDetails,
    };
  }

  async updateCoupons(args: Record<string, unknown>, couponId: string) {
    const oldCoupon: ICoupons = await Coupons.findOne({
      where: { id: couponId },
    });
    if (!oldCoupon) {
      Utils.throwError(ErrorMsg.COUPONS.notFound);
    }

    await Coupons.update(args, { where: { id: couponId } });
    const updatedCoupon: ICoupons = await Coupons.findOne({
      where: { id: couponId },
    });

    return {
      message: SuccessMsg.COUPONS.update,
      coupon: updatedCoupon,
    };
  }

  async deleteCoupons(args: Record<string, unknown>) {
    const oldCoupon: ICoupons = await Coupons.findOne({
      where: { id: args.couponId },
    });
    if (!oldCoupon) {
      Utils.throwError(ErrorMsg.COUPONS.notFound);
    }
    await Coupons.destroy({
      where: { id: args.couponId },
    });

    return {
      message: SuccessMsg.COUPONS.delete,
    };
  }
})();
