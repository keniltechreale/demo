var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import EmergencyContact from '../../models/emergencycontact.model';
import OTP from '../../models/otp.model';
import Users from '../../models/users.model';
export default new (class EmergencyContactService {
    addEmergencyContact(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existContact = yield EmergencyContact.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (existContact) {
                Utils.throwError(ErrorMsg.EmergencyContact.alreadyExist);
            }
            yield EmergencyContact.create(Object.assign({ user_id: userId }, args));
            const otp = Utils.generateOTP();
            // await sendEmergencyContactOTP(args.phone_number, otp);
            yield OTP.create({ user: `${userId}`, otp: otp, type: 'emergency_contact' });
            return {
                message: SuccessMsg.EmergencyContact.add,
                otp: otp,
            };
        });
    }
    verifyOtp(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existContact = yield EmergencyContact.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (!existContact) {
                Utils.throwError(ErrorMsg.EmergencyContact.notFound);
            }
            else {
                const otp = yield OTP.findOne({
                    where: { user: `${userId}`, type: 'emergency_contact', otp: args.otp },
                });
                if (!otp) {
                    Utils.throwError(ErrorMsg.USER.incorrectOtp);
                }
                else {
                    yield OTP.destroy({ where: { user: `${userId}`, type: 'emergency_contact' } });
                    yield EmergencyContact.update({ verified: true }, {
                        where: { country_code: args.country_code, phone_number: args.phone_number },
                    });
                    return {
                        message: SuccessMsg.USER.verifyOtp,
                    };
                }
            }
        });
    }
    resendOtp(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield Users.findOne({
                where: { id: userId },
            });
            if (!user) {
                Utils.throwError(ErrorMsg.USER.notFound);
            }
            const existContact = yield EmergencyContact.findOne({
                where: { country_code: args.country_code, phone_number: args.phone_number },
            });
            if (!existContact) {
                Utils.throwError(ErrorMsg.EmergencyContact.notFound);
            }
            yield OTP.destroy({ where: { user: `${user.id}`, type: 'emergency_contact' } });
            const otp = Utils.generateOTP();
            yield OTP.create({ user: `${user.id}`, otp: otp, type: 'emergency_contact' });
            return {
                message: SuccessMsg.USER.sendOtp,
                otp: otp,
            };
        });
    }
    getEmergencyContactById(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactDetails = yield EmergencyContact.findAll({
                where: { user_id: args.userId },
            });
            return {
                message: SuccessMsg.EmergencyContact.get,
                contact: contactDetails,
            };
        });
    }
    updateEmergencyContact(args, id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactDetails = yield EmergencyContact.findOne({ where: { id: id } });
            if (!contactDetails) {
                Utils.throwError(ErrorMsg.EmergencyContact.notFound);
            }
            if (contactDetails.user_id !== userId) {
                Utils.throwError(ErrorMsg.EmergencyContact.unauthorized);
            }
            yield EmergencyContact.update(args, {
                where: { id: id },
            });
            const updatedContact = yield EmergencyContact.findOne({
                where: { id: id },
            });
            return {
                message: SuccessMsg.EmergencyContact.update,
                contact: updatedContact,
            };
        });
    }
    deleteEmergencyContact(args, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactDetails = yield EmergencyContact.findOne({
                where: { id: args.id },
            });
            if (!contactDetails) {
                Utils.throwError(ErrorMsg.EmergencyContact.notFound);
            }
            if (contactDetails.user_id !== userId) {
                Utils.throwError(ErrorMsg.EmergencyContact.unauthorized);
            }
            yield EmergencyContact.destroy({ where: { id: args.id } });
            return {
                message: SuccessMsg.EmergencyContact.delete,
            };
        });
    }
})();
//# sourceMappingURL=emergencycontact.service.js.map