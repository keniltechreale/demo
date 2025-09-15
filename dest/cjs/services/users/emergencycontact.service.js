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
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const emergencycontact_model_1 = __importDefault(require("../../models/emergencycontact.model"));
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
exports.default = new (class EmergencyContactService {
    addEmergencyContact(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existContact = yield emergencycontact_model_1.default.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (existContact) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.alreadyExist);
            }
            yield emergencycontact_model_1.default.create(Object.assign({ user_id: userId }, args));
            const otp = Utils.generateOTP();
            // await sendEmergencyContactOTP(args.phone_number, otp);
            yield otp_model_1.default.create({ user: `${userId}`, otp: otp, type: 'emergency_contact' });
            return {
                message: constants_1.SuccessMsg.EmergencyContact.add,
                otp: otp,
            };
        });
    }
    verifyOtp(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existContact = yield emergencycontact_model_1.default.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (!existContact) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.notFound);
            }
            else {
                const otp = yield otp_model_1.default.findOne({
                    where: { user: `${userId}`, type: 'emergency_contact', otp: args.otp },
                });
                if (!otp) {
                    Utils.throwError(constants_1.ErrorMsg.USER.incorrectOtp);
                }
                else {
                    yield otp_model_1.default.destroy({ where: { user: `${userId}`, type: 'emergency_contact' } });
                    yield emergencycontact_model_1.default.update({ verified: true }, {
                        where: { country_code: args.country_code, phone_number: args.phone_number },
                    });
                    return {
                        message: constants_1.SuccessMsg.USER.verifyOtp,
                    };
                }
            }
        });
    }
    resendOtp(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_model_1.default.findOne({
                where: { id: userId },
            });
            if (!user) {
                Utils.throwError(constants_1.ErrorMsg.USER.notFound);
            }
            const existContact = yield emergencycontact_model_1.default.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (!existContact) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.notFound);
            }
            yield otp_model_1.default.destroy({ where: { user: `${user.id}`, type: 'emergency_contact' } });
            const otp = Utils.generateOTP();
            yield otp_model_1.default.create({ user: `${user.id}`, otp: otp, type: 'emergency_contact' });
            return {
                message: constants_1.SuccessMsg.USER.sendOtp,
                otp: otp,
            };
        });
    }
    getEmergencyContactById(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactDetails = yield emergencycontact_model_1.default.findAll({
                where: { user_id: args.userId },
            });
            return {
                message: constants_1.SuccessMsg.EmergencyContact.get,
                contact: contactDetails,
            };
        });
    }
    updateEmergencyContact(args, id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactDetails = yield emergencycontact_model_1.default.findOne({ where: { id: id } });
            if (!contactDetails) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.notFound);
            }
            if (contactDetails.user_id !== userId) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.unauthorized);
            }
            yield emergencycontact_model_1.default.update(args, {
                where: { id: id },
            });
            const updatedContact = yield emergencycontact_model_1.default.findOne({
                where: { id: id },
            });
            return {
                message: constants_1.SuccessMsg.EmergencyContact.update,
                contact: updatedContact,
            };
        });
    }
    deleteEmergencyContact(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactDetails = yield emergencycontact_model_1.default.findOne({
                where: { id: args.id },
            });
            if (!contactDetails) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.notFound);
            }
            if (contactDetails.user_id !== userId) {
                Utils.throwError(constants_1.ErrorMsg.EmergencyContact.unauthorized);
            }
            yield emergencycontact_model_1.default.destroy({ where: { id: args.id } });
            return {
                message: constants_1.SuccessMsg.EmergencyContact.delete,
            };
        });
    }
})();
//# sourceMappingURL=emergencycontact.service.js.map