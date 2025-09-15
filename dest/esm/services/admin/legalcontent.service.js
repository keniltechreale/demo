var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import LegalContent from '../../models/legalcontent.model';
import Notifications from '../../models/notifications.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
import ContactUs from '../../models/contactus.model';
import { sendContactUsMail } from '../../lib/email.utils';
import Ride from '../../models/rides.model';
import CashoutRequests from '../../models/cashoutRequest.model';
import Users from '../../models/users.model';
export default new (class LegalContentServices {
    updateLegalContent(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const legalContent = yield LegalContent.findOne({ where: { type: type } });
            let updatedContent;
            if (legalContent) {
                yield LegalContent.update(args, { where: { type: type } });
                updatedContent = yield LegalContent.findOne({ where: { type: type } });
            }
            else {
                updatedContent = yield LegalContent.create(Object.assign({ type: type }, args));
            }
            return {
                message: SuccessMsg.LEGALCONTENT.update,
                legalContent: updatedContent,
            };
        });
    }
    getLegalContent(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const legalContent = yield LegalContent.findOne({ where: { type: type } });
            if (!legalContent) {
                Utils.throwError(ErrorMsg.LEGALCONTENT.notFound);
            }
            return {
                message: SuccessMsg.LEGALCONTENT.get,
                legalContent: legalContent,
            };
        });
    }
    getNotifications(arg, adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, isRead, type } = arg;
            const skip = (page - 1) * limit;
            const filterObject = { admin: adminId };
            if (type) {
                filterObject.type = type;
            }
            if (isRead === 'read') {
                filterObject.isRead = true;
            }
            else if (isRead === 'unread') {
                filterObject.isRead = false;
            }
            if ((search === null || search === void 0 ? void 0 : search.length) > 0) {
                filterObject['$or'] = [
                    { title: new RegExp(search, 'ig') },
                    { body: new RegExp(search, 'ig') },
                ];
            }
            const totalCount = yield Notifications.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const notifications = yield Notifications.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            for (const notification of notifications) {
                if (notification.type === 'rides' && notification.meta_data.ride) {
                    const rideId = notification.meta_data.ride;
                    const rideDetails = yield Ride.findOne({
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
                    const cashoutRequestDetails = yield CashoutRequests.findOne({
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
        });
    }
    updateNotification(args, notifyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield Notifications.findOne({ where: { id: notifyId } });
            if (!notifications) {
                Utils.throwError(ErrorMsg.LEGALCONTENT.notifynotFound);
            }
            yield Notifications.update(args, { where: { id: notifyId } });
            return {
                message: SuccessMsg.NOTIFICATIONS.update,
                notifications: notifications,
            };
        });
    }
    getContactUs(arg) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search } = arg;
            const skip = (page - 1) * limit;
            let filterObject = {};
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
            const totalCount = yield ContactUs.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ContactUsDetails = yield ContactUs.findAll({
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
        });
    }
    sendContactUsReply(args, contactusId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactUsDetails = yield ContactUs.findOne({ where: { id: contactusId } });
            if (!contactUsDetails) {
                Utils.throwError(ErrorMsg.CONTACTMESSAGE.notFound);
            }
            if (contactUsDetails.replied) {
                Utils.throwError(ErrorMsg.CONTACTMESSAGE.alreadyReplied);
            }
            yield ContactUs.update({ replied: true, replyContent: args.content }, { where: { id: contactusId } });
            yield sendContactUsMail(contactUsDetails.email, args.content);
            return {
                message: SuccessMsg.USER.mail,
            };
        });
    }
})();
//# sourceMappingURL=legalcontent.service.js.map