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
const legalcontent_model_1 = __importDefault(require("../../models/legalcontent.model"));
const notifications_model_1 = __importDefault(require("../../models/notifications.model"));
const Utils = __importStar(require("../../lib/utils"));
const constants_1 = require("../../lib/constants");
const sequelize_1 = require("sequelize");
const contactus_model_1 = __importDefault(require("../../models/contactus.model"));
const email_utils_1 = require("../../lib/email.utils");
const rides_model_1 = __importDefault(require("../../models/rides.model"));
const cashoutRequest_model_1 = __importDefault(require("../../models/cashoutRequest.model"));
const users_model_1 = __importDefault(require("../../models/users.model"));
exports.default = new (class LegalContentServices {
    updateLegalContent(args, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const legalContent = yield legalcontent_model_1.default.findOne({ where: { type: type } });
            let updatedContent;
            if (legalContent) {
                yield legalcontent_model_1.default.update(args, { where: { type: type } });
                updatedContent = yield legalcontent_model_1.default.findOne({ where: { type: type } });
            }
            else {
                updatedContent = yield legalcontent_model_1.default.create(Object.assign({ type: type }, args));
            }
            return {
                message: constants_1.SuccessMsg.LEGALCONTENT.update,
                legalContent: updatedContent,
            };
        });
    }
    getLegalContent(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const legalContent = yield legalcontent_model_1.default.findOne({ where: { type: type } });
            if (!legalContent) {
                Utils.throwError(constants_1.ErrorMsg.LEGALCONTENT.notFound);
            }
            return {
                message: constants_1.SuccessMsg.LEGALCONTENT.get,
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
            const totalCount = yield notifications_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const notifications = yield notifications_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            for (const notification of notifications) {
                if (notification.type === 'rides' && notification.meta_data.ride) {
                    const rideId = notification.meta_data.ride;
                    const rideDetails = yield rides_model_1.default.findOne({
                        where: { id: rideId },
                        include: [
                            {
                                model: users_model_1.default,
                                as: 'driver',
                                attributes: ['id', 'name'],
                            },
                            {
                                model: users_model_1.default,
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
                    const cashoutRequestDetails = yield cashoutRequest_model_1.default.findOne({
                        where: { id: cashoutRequestId },
                        raw: true,
                    });
                    if (cashoutRequestDetails) {
                        notification.meta_data.cashoutRequestDetails = cashoutRequestDetails;
                    }
                }
            }
            return {
                message: constants_1.SuccessMsg.NOTIFICATIONS.get,
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
            const notifications = yield notifications_model_1.default.findOne({ where: { id: notifyId } });
            if (!notifications) {
                Utils.throwError(constants_1.ErrorMsg.LEGALCONTENT.notifynotFound);
            }
            yield notifications_model_1.default.update(args, { where: { id: notifyId } });
            return {
                message: constants_1.SuccessMsg.NOTIFICATIONS.update,
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
                    [sequelize_1.Op.or]: [
                        { first_name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { last_name: { [sequelize_1.Op.like]: `%${search}%` } },
                        { email: { [sequelize_1.Op.like]: `%${search}%` } },
                        { phone_number: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            const totalCount = yield contactus_model_1.default.count({ where: filterObject });
            const totalPage = Math.ceil(totalCount / limit);
            const ContactUsDetails = yield contactus_model_1.default.findAll({
                where: filterObject,
                order: [['createdAt', 'DESC']],
                offset: skip,
                limit: limit,
                raw: true,
            });
            return {
                message: constants_1.SuccessMsg.CONTACTUS.get,
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
            const contactUsDetails = yield contactus_model_1.default.findOne({ where: { id: contactusId } });
            if (!contactUsDetails) {
                Utils.throwError(constants_1.ErrorMsg.CONTACTMESSAGE.notFound);
            }
            if (contactUsDetails.replied) {
                Utils.throwError(constants_1.ErrorMsg.CONTACTMESSAGE.alreadyReplied);
            }
            yield contactus_model_1.default.update({ replied: true, replyContent: args.content }, { where: { id: contactusId } });
            yield (0, email_utils_1.sendContactUsMail)(contactUsDetails.email, args.content);
            return {
                message: constants_1.SuccessMsg.USER.mail,
            };
        });
    }
})();
//# sourceMappingURL=legalcontent.service.js.map