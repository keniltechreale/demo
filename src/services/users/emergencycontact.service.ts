import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { IEmergencyData } from '../../middleware/validation.middleware';
import EmergencyContact, { IEmergencyContact } from '../../models/emergencycontact.model';
import OTP, { IOTP } from '../../models/otp.model';
import Users, { IUser } from '../../models/users.model';
import { sendEmergencyContactOTP } from '../../lib/twilio.utils';

export default new (class EmergencyContactService {
  async addEmergencyContact(args: IEmergencyData, userId: number) {
    const existContact: IEmergencyContact = await EmergencyContact.findOne({
      where: { country_code: args.country_code, phone_number: args.phone_number },
    });
    if (existContact) {
      Utils.throwError(ErrorMsg.EmergencyContact.alreadyExist);
    }

    await EmergencyContact.create({
      user_id: userId,
      ...args,
    });
    const otp = Utils.generateOTP();
    // await sendEmergencyContactOTP(args.phone_number, otp);

    await OTP.create({ user: `${userId}`, otp: otp, type: 'emergency_contact' });

    return {
      message: SuccessMsg.EmergencyContact.add,
      otp: otp,
    };
  }

  async verifyOtp(args: Record<string, unknown>, userId: number) {
    const existContact: IEmergencyContact = await EmergencyContact.findOne({
      where: { country_code: args.country_code, phone_number: args.phone_number },
    });

    if (!existContact) {
      Utils.throwError(ErrorMsg.EmergencyContact.notFound);
    } else {
      const otp: IOTP = await OTP.findOne({
        where: { user: `${userId}`, type: 'emergency_contact', otp: args.otp },
      });

      if (!otp) {
        Utils.throwError(ErrorMsg.USER.incorrectOtp);
      } else {
        await OTP.destroy({ where: { user: `${userId}`, type: 'emergency_contact' } });
        await EmergencyContact.update(
          { verified: true },
          {
            where: { country_code: args.country_code, phone_number: args.phone_number },
          },
        );

        return {
          message: SuccessMsg.USER.verifyOtp,
        };
      }
    }
  }

  async resendOtp(args: Record<string, unknown>, userId: number) {
    const user: IUser = await Users.findOne({
      where: { id: userId },
    });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    const existContact: IEmergencyContact = await EmergencyContact.findOne({
      where: { country_code: args.country_code, phone_number: args.phone_number },
    });

    if (!existContact) {
      Utils.throwError(ErrorMsg.EmergencyContact.notFound);
    }
    await OTP.destroy({ where: { user: `${user.id}`, type: 'emergency_contact' } });

    const otp = Utils.generateOTP();
    await OTP.create({ user: `${user.id}`, otp: otp, type: 'emergency_contact' });

    return {
      message: SuccessMsg.USER.sendOtp,
      otp: otp,
    };
  }

  async getEmergencyContactById(args: Record<string, unknown>) {
    const contactDetails: IEmergencyContact[] = await EmergencyContact.findAll({
      where: { user_id: args.userId },
    });
    return {
      message: SuccessMsg.EmergencyContact.get,
      contact: contactDetails,
    };
  }

  async updateEmergencyContact(args: IEmergencyData, id: string, userId: number) {
    const contactDetails: IEmergencyContact = await EmergencyContact.findOne({ where: { id: id } });

    if (!contactDetails) {
      Utils.throwError(ErrorMsg.EmergencyContact.notFound);
    }

    if (contactDetails.user_id !== userId) {
      Utils.throwError(ErrorMsg.EmergencyContact.unauthorized);
    }

    await EmergencyContact.update(args, {
      where: { id: id },
    });
    const updatedContact: IEmergencyContact = await EmergencyContact.findOne({
      where: { id: id },
    });
    return {
      message: SuccessMsg.EmergencyContact.update,
      contact: updatedContact,
    };
  }

  async deleteEmergencyContact(args: Record<string, unknown>, userId: number) {
    const contactDetails: IEmergencyContact = await EmergencyContact.findOne({
      where: { id: args.id },
    });
    if (!contactDetails) {
      Utils.throwError(ErrorMsg.EmergencyContact.notFound);
    }

    if (contactDetails.user_id !== userId) {
      Utils.throwError(ErrorMsg.EmergencyContact.unauthorized);
    }

    await EmergencyContact.destroy({ where: { id: args.id } });
    return {
      message: SuccessMsg.EmergencyContact.delete,
    };
  }
})();
