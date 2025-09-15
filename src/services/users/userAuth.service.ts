import { ForgotPasswordData, VerifyOtpData } from '../../middleware/validation.middleware';
import Users, { IUser } from '../../models/users.model';
import OTP, { IOTP } from '../../models/otp.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import * as JwtUtils from '../../lib/jwt.utils';
import * as HashUtils from '../../lib/hash.utils';
import { generateReferCode, generateUniqueID } from '../../lib/helpFunctions';
import AWSUtils from '../../config/aws.config';
import { removeFilefromS3 } from '../../lib/aws.utils';
import CityManagement, { ICityManagement } from '../../models/citymanagement.model';
import Vehicle from '../../models/vehicle.model';
// import ReferFriendsSection from '../../models/referFriend.model';
import Wallets from '../../models/wallet.model';
import { sendCustomerNotification, sendDriverNotification } from '../../lib/notifications.utils';
// import Transactions from '../../models/transaction.model';
// import { sendLoginOTP, sendRegisterOTP, sendMpinOTP } from '../../lib/twilio.utils';
import Referrals from '../../models/refferal.model';

export default new (class UsersService {
  async register(args: Record<string, string>, role: string) {
    const existUser: IUser = await Users.findOne({
      where: {
        country_code: args.country_code,
        phone_number: args.phone_number,
      },
    });
    if (existUser) {
      if (args.profile_picture) {
        await removeFilefromS3({
          Bucket: AWSUtils.s3BucketName,
          Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
        });
      }
      Utils.throwError(ErrorMsg.USER.phoneAlreadyExist);
    }
    const existEmail: IUser = await Users.findOne({
      where: {
        email: args.email,
      },
    });
    if (existEmail) {
      if (args.profile_picture) {
        await removeFilefromS3({
          Bucket: AWSUtils.s3BucketName,
          Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
        });
      }
      Utils.throwError(ErrorMsg.USER.emailAlreadyExist);
    }
    if (args.referral_code) {
      const existReferral_code: IUser = await Users.findOne({
        where: {
          refer_friends_with: args.referral_code,
          role: role,
        },
      });
      if (!existReferral_code) {
        if (args.profile_picture) {
          await removeFilefromS3({
            Bucket: AWSUtils.s3BucketName,
            Key: args.profile_picture.replace('/profile_picture/', 'profile_picture/'),
          });
        }
        Utils.throwError(ErrorMsg.USER.incorrectReferalCode);
      }
    }
    console.log('args.region ----->>>', args.region);

    const uniqueUserId: string = await generateUniqueID(args.region);
    const referCode = generateReferCode();

    const newUser: IUser = await Users.create({
      user_id: uniqueUserId,
      refer_friends_with: referCode,
      role: role,
      ...args,
    });
    let currency = 'NGN';
    if (args.currency) {
      currency = args.currency;
    }
    if (newUser.referral_code && (newUser.role === 'customer' || newUser.role === 'driver')) {
      const user = await Users.findOne({
        where: { refer_friends_with: newUser.referral_code },
      });
      if (user) {
        await Referrals.create({
          referrer_id: user.id,
          referee_id: newUser.id,
          referral_code: args.referral_code,
          status: 'pending',
          referrer_use_count: 0,
          referee_use_count: 0,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
      }
      if (user.fcm_token && user.role === 'driver') {
        await sendDriverNotification(user, {
          title: `You’ve Got a Reward!`,
          body: `Congratulations! You’ve earned new refferal.`,
          data: {},
          type: `accountSetUp`,
        });
      }
      if (user.fcm_token && user.role === 'customer') {
        await sendCustomerNotification(user, {
          title: `You’ve Got a Reward!`,
          type: `accountSetUp`,
          body: `Congratulations! You’ve earned new refferal.`,
          data: {},
        });
      }
    }

    const customerAmount = 0;
    await Wallets.create({ user: newUser.id, amount: customerAmount, currency: currency });

    const otp = Utils.generateOTP();

    // await sendRegisterOTP(newUser.phone_number, otp);
    await OTP.create({ user: `${newUser.id}`, otp: otp, type: 'register' });

    return {
      message: SuccessMsg.USER.register,
      otp: otp,
    };
  }

  async resendOtp(args: Record<string, string | Date | number | object>) {
    const user: IUser = await Users.findOne({
      where: {
        country_code: args.country_code,
        phone_number: args.phone_number,
      },
    });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }

    await OTP.destroy({ where: { user: `${user.id}`, type: args.type } });
    const otp = Utils.generateOTP();
    // if (args.type === 'register') {
    //   await sendRegisterOTP(user.phone_number, otp);
    // } else if (args.type === 'login') {
    //   await sendLoginOTP(user.phone_number, otp);
    // } else if (args.type === 'forgot_mpin') {
    //   await sendMpinOTP(user.phone_number, otp);
    // }
    // await sendRegisterOTP(user.phone_number, otp);
    await OTP.create({ user: `${user.id}`, otp: otp, type: args.type });

    return {
      message: SuccessMsg.USER.sendOtp,
      otp: otp,
    };
  }

  async verifyOtp(args: VerifyOtpData, type: string) {
    const user: IUser = await Users.findOne({
      where: { country_code: args.country_code, phone_number: args.phone_number },
    });

    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    } else {
      const otp: IOTP = await OTP.findOne({
        where: { user: `${user.id}`, type: type, otp: args.otp },
      });

      if (!otp) {
        Utils.throwError(ErrorMsg.USER.incorrectOtp);
      } else {
        await OTP.destroy({ where: { user: `${user.id}`, type: type } });
        if (type === 'register' || type === 'login') {
          await Users.update({ verify_account: true }, { where: { id: `${user.id}` } });
        }
        const updatedUser = await Users.findOne({ where: { id: `${user.id}` } });
        const token = await JwtUtils.createToken({
          userId: updatedUser.dataValues.id,
          type: 'user',
        } as object);
        return {
          message: SuccessMsg.USER.verifyOtp,
          user: updatedUser,
          token: token,
        };
      }
    }
  }

  async login(args: Record<string, string>, role: string) {
    const user: IUser = await Users.findOne({
      where: {
        country_code: args.country_code,
        phone_number: args.phone_number,
        role: role,
      },
      raw: true,
    });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    console.log('user', user);

    if (user.status === 'inactive') {
      Utils.throwError(ErrorMsg.USER.forbidden);
    }
    if (user.status === 'deleted') {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    const otp = Utils.generateOTP();

    // await sendLoginOTP(user.phone_number, otp);
    await OTP.create({ user: `${user.id}`, otp: otp, type: 'login' });

    if (args.fcm_token) {
      await Users.update({ fcm_token: args.fcm_token }, { where: { id: `${user.id}` } });
    }

    return {
      message: SuccessMsg.USER.login,
      otp: otp,
    };
  }

  async me(args: Record<string, string | Date | number | object>) {
    const user: IUser = await Users.findOne({
      where: { id: args.userId },
      attributes: { exclude: ['mpin'] },
    });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }

    return {
      message: SuccessMsg.USER.profile,
      user: user,
    };
  }

  async changePassword(args: Record<string, unknown>, userId: number) {
    const user: IUser = await Users.findOne({ where: { id: userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    const checkPassword = await HashUtils.compareHash(args.oldPassword as string, user.password);
    if (!checkPassword) {
      Utils.throwError(ErrorMsg.USER.incorrectCredentials);
    }
    if (args.oldPassword === args.newPassword) {
      Utils.throwError(ErrorMsg.USER.samePassword);
    }
    const hashPassword: string = await HashUtils.generateHash(args.newPassword as string);

    await Users.update({ password: hashPassword }, { where: { id: userId } });

    return {
      message: SuccessMsg.USER.passwordUpdated,
      user: user,
    };
  }

  async updateProfile(args: Record<string, unknown>, userId: number) {
    if (args.updateCity) {
      const { country, state, city } = args;
      if (!country) {
        Utils.throwError(ErrorMsg.CITY.notFound);
      }
      let whereClause: Record<string, unknown> = { country };
      if (state) {
        whereClause = { ...whereClause, state };
      }
      if (city) {
        whereClause = { ...whereClause, city };
      }
      const cityExists: ICityManagement = await CityManagement.findOne({ where: whereClause });

      if (!cityExists) {
        return {
          message: SuccessMsg.CITY.comingSoon,
          cityExist: false,
        };
      }
    }
    const oldUser: IUser = await Users.findOne({ where: { id: userId } });
    if (!oldUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    await Users.update(args, { where: { id: userId } });
    const updatedUser: IUser = await Users.findOne({ where: { id: userId } });
    if (oldUser.profile_picture && oldUser.profile_picture !== updatedUser.profile_picture) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: oldUser.profile_picture.replace('/profile_picture/', 'profile_picture/'),
      });
      if (args.profile_picture && oldUser.role === 'driver' && updatedUser.profile_picture) {
        const vehicle = await Vehicle.findOne({ where: { user: userId } });

        if (vehicle) {
          const updatedDocuments = vehicle.documents.map((doc) => {
            if (doc.name === 'profile_picture') {
              return {
                ...doc,
                url: [updatedUser.profile_picture],
                // eslint-disable-next-line @typescript-eslint/prefer-as-const
                status: 'pending' as 'pending',
                reason: null,
              };
            }
            return doc;
          });
          await vehicle.update({ documents: updatedDocuments, showCard: false });
        }
      }
    }

    return {
      message: SuccessMsg.USER.update,
      user: updatedUser,
    };
  }
  async forgotPassword(args: ForgotPasswordData) {
    const user: IUser = await Users.findOne({
      where: {
        email: args.email,
      },
    });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    } else {
      const otp = Utils.generateOTP();

      await OTP.destroy({ where: { user: user.id, type: 'forgot_password' } });

      await OTP.create({ user: user.id, type: 'forgot_password', otp: otp });

      return {
        message: SuccessMsg.USER.sendOtp,
        otp: otp,
      };
    }
  }

  async ResetPassword(args: Record<string, unknown>, userId: number) {
    const user: IUser = await Users.findOne({ where: { id: userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    } else {
      const hashPassword: string = await HashUtils.generateHash(args.password as string);
      await Users.update({ password: hashPassword }, { where: { id: userId } });
      const updatedUser = await Users.findOne({ where: { id: `${user.id}` } });

      const token = await JwtUtils.createToken({
        userId: updatedUser.id,
        type: 'user',
      } as object);

      return {
        message: SuccessMsg.USER.passwordUpdated,
        user: user,
        token: token,
      };
    }
  }

  async deleteUser(userId: number) {
    const user: IUser = await Users.findOne({ where: { id: userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    await Users.update({ deleted_at: new Date(), status: 'deleted' }, { where: { id: userId } });
    if (user.profile_picture) {
      await removeFilefromS3({
        Bucket: AWSUtils.s3BucketName,
        Key: user.profile_picture.replace('/profile_picture/', 'profile_picture/'),
      });
    }
    // if (user.role === 'driver') {
    //   await deleteDriverRelatedData(user);
    // }
    return {
      message: SuccessMsg.USER.delete,
    };
  }

  async Logout(userId: number) {
    const user: IUser = await Users.findOne({ where: { id: userId } });
    if (!user) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    await Users.update({ fcm_token: '' }, { where: { id: userId } });
    return {
      message: SuccessMsg.USER.logout,
    };
  }
})();
