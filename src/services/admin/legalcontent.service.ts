import LegalContent, { ILegalContent } from '../../models/legalcontent.model';
import Notifications, { INotification } from '../../models/notifications.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
import { ISearch } from '../../lib/common.interface';
import ContactUs from '../../models/contactus.model';
import { sendContactUsMail } from '../../lib/email.utils';
import Ride from '../../models/rides.model';
import CashoutRequests from '../../models/cashoutRequest.model';
import Users from '../../models/users.model';

export default new (class LegalContentServices {
  async updateLegalContent(args: Record<string, unknown>, type: string) {
    const legalContent: ILegalContent = await LegalContent.findOne({ where: { type: type } });
    let updatedContent;
    if (legalContent) {
      await LegalContent.update(args, { where: { type: type } });
      updatedContent = await LegalContent.findOne({ where: { type: type } });
    } else {
      updatedContent = await LegalContent.create({ type: type, ...args });
    }
    return {
      message: SuccessMsg.LEGALCONTENT.update,
      legalContent: updatedContent,
    };
  }

  async getLegalContent(type: string) {
    const legalContent = await LegalContent.findOne({ where: { type: type } });
    if (!legalContent) {
      Utils.throwError(ErrorMsg.LEGALCONTENT.notFound);
    }
    return {
      message: SuccessMsg.LEGALCONTENT.get,
      legalContent: legalContent,
    };
  }

  async getNotifications(arg: ISearch, adminId: number) {
    const { page, limit, search, isRead, type } = arg;
    const skip = (page - 1) * limit;

    const filterObject: Record<string, unknown> = { admin: adminId };
    if (type) {
      filterObject.type = type;
    }
    if (isRead === 'read') {
      filterObject.isRead = true;
    } else if (isRead === 'unread') {
      filterObject.isRead = false;
    }
    if (search?.length > 0) {
      filterObject['$or'] = [
        { title: new RegExp(search, 'ig') },
        { body: new RegExp(search, 'ig') },
      ];
    }
    const totalCount = await Notifications.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const notifications: INotification[] = await Notifications.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    for (const notification of notifications) {
      if (notification.type === 'rides' && notification.meta_data.ride) {
        const rideId = notification.meta_data.ride;

        const rideDetails = await Ride.findOne({
          where: { id: rideId },
          include: [
            {
              model: Users,
              as: 'driver',
              attributes: ['id', 'name'],
            },
            {
              model: Users,
              as: 'passenger',
              attributes: ['id', 'name'],
            },
          ],
          attributes: [
            'id',
            'rideId',
            'date',
            'driverId',
            'passengerId',
            'origin',
            'destination',
            'finalAmount',
          ],
          raw: true,
          nest: true,
        });

        if (rideDetails) {
          notification.meta_data.rideDetails = rideDetails;
        }
      }

      if (notification.type === 'cashout_request' && notification.meta_data.cashouRequestId) {
        const cashoutRequestId = notification.meta_data.cashouRequestId;

        const cashoutRequestDetails = await CashoutRequests.findOne({
          where: { id: cashoutRequestId },
          raw: true,
        });

        if (cashoutRequestDetails) {
          notification.meta_data.cashoutRequestDetails = cashoutRequestDetails;
        }
      }
    }

    return {
      message: SuccessMsg.NOTIFICATIONS.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      notifications: notifications,
    };
  }

  async updateNotification(args: Record<string, unknown>, notifyId: string) {
    const notifications = await Notifications.findOne({ where: { id: notifyId } });
    if (!notifications) {
      Utils.throwError(ErrorMsg.LEGALCONTENT.notifynotFound);
    }
    await Notifications.update(args, { where: { id: notifyId } });
    return {
      message: SuccessMsg.NOTIFICATIONS.update,
      notifications: notifications,
    };
  }

  async getContactUs(arg: ISearch) {
    const { page, limit, search } = arg;

    const skip = (page - 1) * limit;

    let filterObject: Record<string, unknown> = {};
    if (search && search.length > 0) {
      filterObject = {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone_number: { [Op.like]: `%${search}%` } },
        ],
      };
    }

    const totalCount = await ContactUs.count({ where: filterObject });
    const totalPage = Math.ceil(totalCount / limit);
    const ContactUsDetails = await ContactUs.findAll({
      where: filterObject,
      order: [['createdAt', 'DESC']],
      offset: skip,
      limit: limit,
      raw: true,
    });

    return {
      message: SuccessMsg.CONTACTUS.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      contactus: ContactUsDetails,
    };
  }

  async sendContactUsReply(args: Record<string, string>, contactusId: string) {
    const contactUsDetails = await ContactUs.findOne({ where: { id: contactusId } });
    if (!contactUsDetails) {
      Utils.throwError(ErrorMsg.CONTACTMESSAGE.notFound);
    }
    if (contactUsDetails.replied) {
      Utils.throwError(ErrorMsg.CONTACTMESSAGE.alreadyReplied);
    }
    await ContactUs.update(
      { replied: true, replyContent: args.content },
      { where: { id: contactusId } },
    );
    await sendContactUsMail(contactUsDetails.email, args.content);
    return {
      message: SuccessMsg.USER.mail,
    };
  }
})();
