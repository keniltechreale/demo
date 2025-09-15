var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Coupons from '../../models/coupon.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { generateUniqueCouponCode } from '../../lib/helpFunctions';
import { Op } from 'sequelize';
export default new (class CouponService {
    addCoupons(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const code = generateUniqueCouponCode();
            console.log(code, args);
            if (args.start_date) {
                const startDate = new Date(args.start_date);
                const today = new Date();
                if (startDate > today) {
                    args.status = 'inactive';
                }
            }
            const newCoupon = yield Coupons.create(Object.assign({ code }, args));
            return {
                message: SuccessMsg.COUPONS.add,
                coupon: newCoupon,
            };
        });
    }
    getAllCoupons(arg) {
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
                        { code: { [Op.like]: `%${search}%` } },
                        { title: { [Op.like]: `%${search}%` } },
                        { subTitle: { [Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield Coupons.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const couponDetails = yield Coupons.findAll({
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
        });
    }
    updateCoupons(args, couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCoupon = yield Coupons.findOne({
                where: { id: couponId },
            });
            if (!oldCoupon) {
                Utils.throwError(ErrorMsg.COUPONS.notFound);
            }
            yield Coupons.update(args, { where: { id: couponId } });
            const updatedCoupon = yield Coupons.findOne({
                where: { id: couponId },
            });
            return {
                message: SuccessMsg.COUPONS.update,
                coupon: updatedCoupon,
            };
        });
    }
    deleteCoupons(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldCoupon = yield Coupons.findOne({
                where: { id: args.couponId },
            });
            if (!oldCoupon) {
                Utils.throwError(ErrorMsg.COUPONS.notFound);
            }
            yield Coupons.destroy({
                where: { id: args.couponId },
            });
            return {
                message: SuccessMsg.COUPONS.delete,
            };
        });
    }
})();
//# sourceMappingURL=coupon.service.js.map