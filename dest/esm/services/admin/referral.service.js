var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Referrals from '../../models/refferal.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
export default new (class ReferralService {
    getAllReferrals(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status)
                filterObject.status = status;
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = Object.assign(Object.assign({}, filterObject), { [Op.or]: [{ referral_code: { [Op.like]: `%${search}%` } }] });
            }
            const totalCount = yield Referrals.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const referralDetails = yield Referrals.findAll({
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
        });
    }
    updateReferral(args, referralId) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldReferral = yield Referrals.findOne({ where: { id: referralId } });
            if (!oldReferral) {
                Utils.throwError(ErrorMsg.REFERRAL.notFound);
            }
            yield Referrals.update(args, { where: { id: referralId } });
            const updatedReferral = yield Referrals.findOne({
                where: { id: referralId },
            });
            return {
                message: SuccessMsg.REFERRAL.update,
                referral: updatedReferral,
            };
        });
    }
    deleteReferral(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldReferral = yield Referrals.findOne({
                where: { id: args.referralId },
            });
            if (!oldReferral) {
                Utils.throwError(ErrorMsg.REFERRAL.notFound);
            }
            yield Referrals.destroy({ where: { id: args.referralId } });
            return {
                message: SuccessMsg.REFERRAL.delete,
            };
        });
    }
})();
//# sourceMappingURL=referral.service.js.map