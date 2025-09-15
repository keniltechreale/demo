import { IAdminLoginData, ForgotPasswordData } from '../../middleware/validation.middleware';
import AdminUser, { IAdminUser } from '../../models/admin.model';
import OTP, { IOTP } from '../../models/otp.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import * as HashUtils from '../../lib/hash.utils';
import * as JwtUtils from '../../lib/jwt.utils';

export default new (class AdminUserService {
  async login(args: IAdminLoginData) {
    const adminUser: IAdminUser = await AdminUser.findOne({ where: { email: args.email } });
    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }

    const hashCompareResult = await HashUtils.compareHash(args.password, adminUser.password);
    if (!hashCompareResult) {
      Utils.throwError(ErrorMsg.USER.incorrectCredentials);
    }

    delete adminUser.password;
    const admin = await AdminUser.findOne({ where: { email: args.email } });

    const token = await JwtUtils.createToken({ ...admin.dataValues, type: 'admin' } as object);
    return {
      message: SuccessMsg.USER.login,
      user: adminUser,
      token: token,
    };
  }

  async me(args: Record<string, string | Date | number | object>) {
    const adminUser: IAdminUser = await AdminUser.findOne({
      where: { id: args.userId },
      attributes: { exclude: ['password'] },
    });
    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    return {
      user: adminUser,
    };
  }

  async forgotPassword(args: ForgotPasswordData) {
    const adminUser: IAdminUser = await AdminUser.findOne({
      where: { email: args.email },
      attributes: { exclude: ['password'] },
    });
    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    } else {
      const otp: string = Utils.generateOTP();
      const userId: string = `${adminUser.id}`;
      await OTP.destroy({ where: { user: userId } });
      await OTP.create({ user: userId, type: 'forgot_password', otp: otp });
      const admin = await AdminUser.findOne({ where: { email: args.email } });
      const token = await JwtUtils.createToken({ ...admin.dataValues, type: 'admin' } as object);

      return {
        message: SuccessMsg.USER.sendOtp,
        user: adminUser,
        token: token,
        otp: otp,
      };
    }
  }

  async verifyOtp(args: Record<string, unknown>, userId: number) {
    const adminUser: IAdminUser = await AdminUser.findOne({
      where: { id: userId },
      attributes: { exclude: ['password'] },
    });
    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    } else {
      const otp: IOTP = await OTP.findOne({
        where: {
          user: userId,
          type: 'forgot_password',
          otp: args.otp,
        },
      });
      if (!otp) {
        Utils.throwError(ErrorMsg.USER.incorrectCredentials);
      } else {
        await OTP.destroy({ where: { user: userId } });
        return {
          message: SuccessMsg.USER.verifyOtp,
          user: adminUser,
        };
      }
    }
  }

  async resetPassword(args: Record<string, string>, userId: number) {
    const adminUser: IAdminUser = await AdminUser.findOne({ where: { id: userId } });

    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    } else {
      //   const hashPassword: string = await generateHash(args.password);
      await AdminUser.update({ password: args.password }, { where: { id: userId } });

      return {
        message: SuccessMsg.USER.passwordUpdated,
        user: adminUser,
      };
    }
  }
})();
