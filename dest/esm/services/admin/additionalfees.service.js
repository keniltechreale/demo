var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import AdditionalFee from '../../models/AdditionalFees';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
export default new (class AdditionalFeesService {
    addAdditionalFee(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const existingFee = yield AdditionalFee.findOne({
                where: { type: args.type },
            });
            if (existingFee) {
                Utils.throwError((_a = ErrorMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.alreadyExists);
            }
            const newFee = yield AdditionalFee.create(args);
            return {
                message: (_b = SuccessMsg.ADDITIONAL_FEES) === null || _b === void 0 ? void 0 : _b.add,
                additionalFee: newFee,
            };
        });
    }
    getAllAdditionalFees(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { page, limit, search, status } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
            if (status) {
                filterObject.status = status;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject = Object.assign(Object.assign({}, filterObject), { [Op.or]: [
                        { type: { [Op.like]: `%${search}%` } },
                        { applyOn: { [Op.like]: `%${search}%` } },
                    ] });
            }
            const totalCount = yield AdditionalFee.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const additionalFees = yield AdditionalFee.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: (_a = SuccessMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.get,
                page: page,
                perPage: limit,
                totalCount: totalCount,
                totalPage: totalPage,
                additionalFees: additionalFees,
            };
        });
    }
    updateAdditionalFee(args, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const oldFee = (yield AdditionalFee.findOne({
                where: { id },
            }));
            if (!oldFee) {
                Utils.throwError((_a = ErrorMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.notFound);
            }
            if (args.type) {
                const existingFee = yield AdditionalFee.findOne({
                    where: {
                        type: args.type,
                        id: { [Op.ne]: id },
                    },
                });
                if (existingFee) {
                    Utils.throwError((_b = ErrorMsg.ADDITIONAL_FEES) === null || _b === void 0 ? void 0 : _b.alreadyExists);
                }
            }
            yield AdditionalFee.update(args, { where: { id } });
            const updatedFee = (yield AdditionalFee.findOne({
                where: { id },
            }));
            return {
                message: (_c = SuccessMsg.ADDITIONAL_FEES) === null || _c === void 0 ? void 0 : _c.update,
                additionalFee: updatedFee,
            };
        });
    }
    deleteAdditionalFee(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const oldFee = (yield AdditionalFee.findOne({
                where: { id: args.id },
            }));
            if (!oldFee) {
                Utils.throwError((_a = ErrorMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.notFound);
            }
            yield AdditionalFee.destroy({
                where: { id: args.id },
            });
            return {
                message: (_b = SuccessMsg.ADDITIONAL_FEES) === null || _b === void 0 ? void 0 : _b.delete,
            };
        });
    }
})();
//# sourceMappingURL=additionalfees.service.js.map