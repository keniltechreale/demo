"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdditionalFees_1 = __importDefault(require("../../models/AdditionalFees"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const sequelize_1 = require("sequelize");
exports.default = new (class AdditionalFeesService {
    addAdditionalFee(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const existingFee = yield AdditionalFees_1.default.findOne({
                where: { type: args.type },
            });
            if (existingFee) {
                Utils.throwError((_a = constants_1.ErrorMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.alreadyExists);
            }
            const newFee = yield AdditionalFees_1.default.create(args);
            return {
                message: (_b = constants_1.SuccessMsg.ADDITIONAL_FEES) === null || _b === void 0 ? void 0 : _b.add,
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
                filterObject = Object.assign(Object.assign({}, filterObject), { [sequelize_1.Op.or]: [
                        { type: { [sequelize_1.Op.like]: `%${search}%` } },
                        { applyOn: { [sequelize_1.Op.like]: `%${search}%` } },
                    ] });
            }
            const totalCount = yield AdditionalFees_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const additionalFees = yield AdditionalFees_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: (_a = constants_1.SuccessMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.get,
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
            const oldFee = (yield AdditionalFees_1.default.findOne({
                where: { id },
            }));
            if (!oldFee) {
                Utils.throwError((_a = constants_1.ErrorMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.notFound);
            }
            if (args.type) {
                const existingFee = yield AdditionalFees_1.default.findOne({
                    where: {
                        type: args.type,
                        id: { [sequelize_1.Op.ne]: id },
                    },
                });
                if (existingFee) {
                    Utils.throwError((_b = constants_1.ErrorMsg.ADDITIONAL_FEES) === null || _b === void 0 ? void 0 : _b.alreadyExists);
                }
            }
            yield AdditionalFees_1.default.update(args, { where: { id } });
            const updatedFee = (yield AdditionalFees_1.default.findOne({
                where: { id },
            }));
            return {
                message: (_c = constants_1.SuccessMsg.ADDITIONAL_FEES) === null || _c === void 0 ? void 0 : _c.update,
                additionalFee: updatedFee,
            };
        });
    }
    deleteAdditionalFee(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const oldFee = (yield AdditionalFees_1.default.findOne({
                where: { id: args.id },
            }));
            if (!oldFee) {
                Utils.throwError((_a = constants_1.ErrorMsg.ADDITIONAL_FEES) === null || _a === void 0 ? void 0 : _a.notFound);
            }
            yield AdditionalFees_1.default.destroy({
                where: { id: args.id },
            });
            return {
                message: (_b = constants_1.SuccessMsg.ADDITIONAL_FEES) === null || _b === void 0 ? void 0 : _b.delete,
            };
        });
    }
})();
//# sourceMappingURL=additionalfees.service.js.map