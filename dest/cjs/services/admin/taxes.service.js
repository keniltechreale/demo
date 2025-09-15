"use strict";
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
const taxes_model_1 = __importDefault(require("../../models/taxes.model"));
exports.default = new (class TaxesService {
    getTaxes() {
        return __awaiter(this, void 0, void 0, function* () {
            const taxes = yield taxes_model_1.default.findAll({
                where: { is_active: true },
                order: [['created_at', 'DESC']],
            });
            return {
                message: 'Taxes retrieved successfully',
                taxes: taxes,
            };
        });
    }
    updateTaxes(args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if taxes exist
            const existingTaxes = yield taxes_model_1.default.findAll({
                where: { is_active: true },
            });
            if (existingTaxes.length === 0) {
                // Create new taxes if none exist
                const newTaxes = yield taxes_model_1.default.create(args);
                return {
                    message: 'Taxes created successfully',
                    taxes: newTaxes,
                };
            }
            else {
                // Update existing taxes
                const taxId = existingTaxes[0].id;
                yield taxes_model_1.default.update(args, { where: { id: taxId } });
                const updatedTaxes = yield taxes_model_1.default.findOne({
                    where: { id: taxId },
                });
                return {
                    message: 'Taxes updated successfully',
                    taxes: updatedTaxes,
                };
            }
        });
    }
})();
//# sourceMappingURL=taxes.service.js.map